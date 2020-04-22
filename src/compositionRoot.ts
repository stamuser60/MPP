import logger from './logger';
import { cprClientOptions, cprProducerOptions, getDispatcher } from './infrastructure/kafkaDispatcher';
import { UNITY_KAFKA_TOPIC, CPR_KAFKA_TOPIC } from './config';
import { getConsumer, unityConsumerOptions } from './infrastructure/kafkaConsumer';

const enrichmentDispatcher = getDispatcher('CPR', CPR_KAFKA_TOPIC, cprClientOptions, cprProducerOptions, logger);
const dlqDispatcher = getDispatcher('DLQ', CPR_KAFKA_TOPIC, cprClientOptions, cprProducerOptions, logger);
const enrichmentConsumer = getConsumer('Unity', UNITY_KAFKA_TOPIC, unityConsumerOptions, dlqDispatcher, logger);

export { enrichmentDispatcher, enrichmentConsumer };
