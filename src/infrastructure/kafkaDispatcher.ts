import kafka from 'kafka-node';
import { EnrichmentDispatcher } from '../core/enrichmentDispatcher';
import { EnrichmentOutput } from '../core/enrichment';

export class KafkaEnrichmentDispatcher implements EnrichmentDispatcher {
  private producer: kafka.Producer;
  private readonly topic: string;
  constructor(producer: kafka.Producer, topic: string) {
    this.producer = producer;
    this.topic = topic;
  }

  async send(enrichment: EnrichmentOutput): Promise<void> {
    return new Promise((resolve, reject) => {
      this.producer.send(
        [
          {
            topic: this.topic,
            messages: JSON.stringify(enrichment)
          }
        ],
        function(err, data) {
          if (err) {
            reject(err);
          }
          resolve(data);
        }
      );
    });
  }
}
