import { KafkaEnrichmentDispatcher } from './infrastructure/kafkaDispatcher';
import { EnrichmentDispatcher } from './core/enrichmentDispatcher';
import kafka, {
  ConsumerGroupStream,
  ConsumerGroupStreamOptions,
  KafkaClientOptions,
  ProducerOptions
} from 'kafka-node';
import { CPR_KAFKA_CONN, UNITY_KAFKA_CONN, UNITY_KAFKA_TOPIC, CPR_KAFKA_TOPIC, UNITY_KAFKA_GROUP_ID } from './config';
import { KafkaEnrichmentConsumer } from './infrastructure/kafkaConsumer';
import logger from './logger';

const cprClientOptions: KafkaClientOptions = {
  kafkaHost: CPR_KAFKA_CONN as string
};

const producerOptions: ProducerOptions = {
  ackTimeoutMs: 100,
  requireAcks: 1,
  partitionerType: 2 // This is so that the producer will send the messages in roundrobin style
};

const options: ConsumerGroupStreamOptions = {
  kafkaHost: UNITY_KAFKA_CONN,
  groupId: UNITY_KAFKA_GROUP_ID,
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
  encoding: 'utf8',
  fromOffset: 'latest',
  outOfRangeOffset: 'earliest',
  fetchMaxBytes: 1024 * 1024,
  fetchMaxWaitMs: 3000,
  batch: { noAckBatchSize: 20, noAckBatchAge: 3000 },
  // autoCommit is false so we can manage the commits by ourselves
  autoCommit: false
};

const cprClient = new kafka.KafkaClient(cprClientOptions);
const cprKafkaProducer = new kafka.Producer(cprClient, producerOptions);

const unityKafkaConsumerGroup = new ConsumerGroupStream(options, UNITY_KAFKA_TOPIC);

const enrichmentDispatcher: EnrichmentDispatcher = new KafkaEnrichmentDispatcher(cprKafkaProducer, CPR_KAFKA_TOPIC);
const dlqDispatcher: EnrichmentDispatcher = new KafkaEnrichmentDispatcher(cprKafkaProducer, CPR_KAFKA_TOPIC);
const enrichmentConsumer = new KafkaEnrichmentConsumer(unityKafkaConsumerGroup, dlqDispatcher);

cprKafkaProducer.on('error', function(error) {
  logger.error(`MPP kafka producer error: ${error}`);
});
cprKafkaProducer.on('ready', function() {
  logger.debug(`connection to CPR's kafka is complete`);
});
unityKafkaConsumerGroup.on('error', function(error: Error): void {
  logger.error(`MPP kafka consumer error: ${error}`);
});
unityKafkaConsumerGroup.on('connect', function() {
  logger.debug(`connections to Unity's kafka is complete`);
});
unityKafkaConsumerGroup.on('rebalancing', function() {
  logger.debug(`rebalance to Unity's kafka is starting`);
});
unityKafkaConsumerGroup.on('rebalanced', function() {
  logger.debug(`rebalance to Unity's kafka is complete`);
});

export { enrichmentDispatcher, enrichmentConsumer };
