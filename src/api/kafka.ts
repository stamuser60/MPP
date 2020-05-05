import { validateEnrichmentsReceived } from './validation';
import { sendEnrichment } from '../app/app';
import { enrichmentConsumer, enrichmentDispatcher } from '../compositionRoot';
import logger from '../logger';
import { hermeticityTypeName } from '../core/hermeticity';
import { HermeticityReceived } from '../app/dto';
import { TypeName } from '../core/types';
import { DispatchError } from '../core/exc';
import { EnrichmentDispatcher } from '../core/enrichmentDispatcher';
import { UNITY_KAFKA_RETRY_DISPATCH_WAIT_INTERVAL_MS } from '../config';

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}
/**
 * A function that calls the `sendEnrichment` repeatedly until it succeeds or doesn't receive
 * an error that is an instance of `DispatchError`, reason being is that if the problem is that the
 * kafka is down, then we want to continue to try and sending the message until we succeed.
 * @param type: type of the enrichment
 * @param enrichments: list of hermeticity enrichment documents
 * @param enrichmentDispatcher: the dispatcher object which performs the sending of the enrichment
 */
async function sendUntilSuccess(
  type: TypeName,
  enrichments: HermeticityReceived[],
  enrichmentDispatcher: EnrichmentDispatcher
): Promise<void> {
  try {
    await sendEnrichment(hermeticityTypeName, enrichments, enrichmentDispatcher);
  } catch (e) {
    if (e instanceof DispatchError) {
      await wait(UNITY_KAFKA_RETRY_DISPATCH_WAIT_INTERVAL_MS);
      await sendUntilSuccess(type, enrichments, enrichmentDispatcher);
    } else {
      throw e;
    }
  }
}

function addUnityOrigin(value: object | object[]): object | object[] {
  if (Array.isArray(value)) {
    for (const doc of value) {
      (doc as any)['origin'] = 'unityPrometheus';
    }
  } else {
    (value as any)['origin'] = 'unityPrometheus';
  }
  return value;
}

export async function onMessage(value: object | object[]): Promise<void> {
  try {
    value = addUnityOrigin(value);
    const enrichments = validateEnrichmentsReceived(hermeticityTypeName, value);
    await sendUntilSuccess(hermeticityTypeName, enrichments, enrichmentDispatcher);
  } catch (e) {
    logger.error(`while processing message from unity's kafka \n ${e.stack}`);
    throw e;
  }
}

export function startConsumingAlerts(): void {
  enrichmentConsumer.start(onMessage);
}
