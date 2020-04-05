import { Message, Consumer, ConsumerGroup } from 'kafka-node';

export class KafkaEnrichmentConsumer {
  private consumer: Consumer | ConsumerGroup;
  constructor(consumer: Consumer | ConsumerGroup) {
    this.consumer = consumer;
  }

  start(onMessage: (message: Message) => Promise<void>): void {
    this.consumer.on('message', async (message: Message) => {
      await onMessage(message);
    });
  }

  onError(onError: (error: Error) => unknown): void {
    this.consumer.on('error', onError);
  }
}
