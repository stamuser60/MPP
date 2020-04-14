import { Message } from 'kafka-node';
import { validateEnrichment } from './validation';
import { sendEnrichment } from '../app/app';
import { enrichmentConsumer, enrichmentDispatcher } from '../compositionRoot';
import logger from '../logger';
import { hermeticityTypeName } from '../core/hermeticity';

// TODO: decide on how to act when there is a problematic message, do we just throw it all to DLQ or something else?

async function onMessage(message: Message): Promise<void> {
  try {
    const messageObj = JSON.parse(message.value.toString());
    const enrichment = validateEnrichment(hermeticityTypeName, messageObj);
    await sendEnrichment(hermeticityTypeName, enrichment, enrichmentDispatcher);
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
