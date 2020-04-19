import { Message } from 'kafka-node';
import { validateEnrichment } from './validation';
import { sendEnrichment } from '../app/app';
import { enrichmentConsumer, enrichmentDispatcher } from '../compositionRoot';
import logger from '../logger';
import { hermeticityTypeName } from '../core/hermeticity';
import { HermeticityReceived } from '../app/dto';
import { TypeName } from '../core/types';
import { DispatchError } from '../core/exc';
import { EnrichmentDispatcher } from '../core/enrichmentDispatcher';

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}
const RETRY_WAIT_INTERVAL_MS = 3000;
/**
 * A function that calls the `sendEnrichment` repeatedly until it succeeds or doesn't receive
 * an error that is an instance of `DispatchError`, reason being is that if the problem is that the
 * kafka is down, then we want to continue to try and sending the message until we succeed.
 * @param type: type of the enrichment
 * @param enrichment: the enrichment document itself
 * @param enrichmentDispatcher: the dispatcher object which performs the sending of the enrichment
 */
async function sendUntilSuccess(
  type: TypeName,
  enrichment: HermeticityReceived,
  enrichmentDispatcher: EnrichmentDispatcher
): Promise<void> {
  try {
    await sendEnrichment(hermeticityTypeName, enrichment, enrichmentDispatcher);
  } catch (e) {
    if (e instanceof DispatchError) {
      await wait(RETRY_WAIT_INTERVAL_MS);
      await sendUntilSuccess(type, enrichment, enrichmentDispatcher);
    } else {
      throw e;
    }
  }
}

async function onMessage(message: Message): Promise<void> {
  try {
    const messageObj = JSON.parse(message.value.toString());
    const enrichment = validateEnrichment(hermeticityTypeName, messageObj);
    await sendUntilSuccess(hermeticityTypeName, enrichment, enrichmentDispatcher);
  } catch (e) {
    logger.error(`while processing message from unity's kafka \n ${e.stack}`);
    throw e;
  }
}

function onError(error: Error): void {
  logger.error(`Error while consuming enrichments \n ${error.stack}`);
}

export function startConsumingAlerts(): void {
  enrichmentConsumer.start(onMessage);
  enrichmentConsumer.onError(onError);
}
