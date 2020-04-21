import { Producer } from 'kafka-node';
import { EnrichmentDispatcher } from '../core/enrichmentDispatcher';
import { EnrichmentOutput } from '../core/enrichment';
import { TypeName } from '../core/types';
import { DispatchError } from '../core/exc';

type promiseExecutor<T> = (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void;
class RetryablePromise<T> extends Promise<T> {
  static retry<T>(retries: number, executor: promiseExecutor<T>): Promise<T> {
    return new RetryablePromise(executor).catch(error =>
      retries > 0 ? RetryablePromise.retry(retries - 1, executor) : RetryablePromise.reject(error)
    );
  }
}

const SEND_RETRY_NUMBER = 2;

export class KafkaEnrichmentDispatcher implements EnrichmentDispatcher {
  private producer: Producer;
  private readonly topicName: string;
  constructor(producer: Producer, topicName: string) {
    this.producer = producer;
    this.topicName = topicName;
  }

  async send(enrichments: EnrichmentOutput<TypeName>[]): Promise<void> {
    return RetryablePromise.retry(SEND_RETRY_NUMBER, (resolve, reject) => {
      this.producer.send(
        [
          {
            topic: this.topicName,
            messages: JSON.stringify(enrichments)
          }
        ],
        function(err, data) {
          if (err) {
            reject(new DispatchError(`Error sending message to kafka: ${err.toString()}`, 503));
          }
          resolve(data);
        }
      );
    });
  }
}
