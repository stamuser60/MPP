import { Producer } from 'kafka-node';
import { EnrichmentDispatcher } from '../core/enrichmentDispatcher';
import { EnrichmentOutput } from '../core/enrichment';
import { TypeName } from '../core/types';

// TODO: implement a retry mechanism on `send`

export class KafkaEnrichmentDispatcher implements EnrichmentDispatcher {
  private producer: Producer;
  private readonly topicName: string;
  constructor(producer: Producer, topicName: string) {
    this.producer = producer;
    this.topicName = topicName;
  }

  async send(enrichment: EnrichmentOutput<TypeName>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.producer.send(
        [
          {
            topic: this.topicName,
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
