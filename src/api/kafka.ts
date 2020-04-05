import { Message } from 'kafka-node';
import { validateEnrichment } from './validation';
import { EnrichmentType, sendEnrichment } from '../app/app';
import { EnrichmentReceived } from '../app/dto';
import { enrichmentConsumer, enrichmentDispatcher } from '../compositionRoot';
import logger from '../logger';

//TODO: the two calls to `logger.error` basically log the same data, but in different way, decide which was is the best

async function onMessage(message: Message): Promise<void> {
  try {
    const messageObj = JSON.parse(message.value.toString());
    validateEnrichment(EnrichmentType.hermeticity, messageObj);
    await sendEnrichment(EnrichmentType.hermeticity, messageObj as EnrichmentReceived, enrichmentDispatcher);
  } catch (e) {
    logger.error(`while processing message from unity's kafka: ${e.message} \n ${e.stack}`);
  }
}

function onError(error: Error): void {
  logger.error({
    message: 'Error while consuming enrichments: ' + error.message,
    stack: error.stack
  });
}

export function startConsumingAlerts(): void {
  enrichmentConsumer.start(onMessage);
  enrichmentConsumer.onError(onError);
}
