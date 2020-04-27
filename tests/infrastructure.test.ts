require('dotenv/config');
import sinon, { SinonSandbox } from 'sinon';
import { expect } from 'chai';
import { Readable } from 'stream';
import logger from '../src/logger';
import { ConsumerGroupStream, Message, Producer } from 'kafka-node';
import { KafkaEnrichmentDispatcher } from '../src/infrastructure/kafkaDispatcher';
import { KafkaEnrichmentConsumer } from '../src/infrastructure/kafkaConsumer';
import { EnrichmentOutput } from '../src/core/enrichment';

const msg: Message = {
  topic: 'test',
  value: `{"test": "test message"}`
};

describe('Infrastructure', function() {
  const sandbox: SinonSandbox = sinon.createSandbox();
  let dispatcher: KafkaEnrichmentDispatcher;
  let consumer: KafkaEnrichmentConsumer;
  let dlqDispatcher: KafkaEnrichmentDispatcher;
  let kafkaProducer: Producer;
  let kafkaDlqProducer: Producer;
  let kafkaConsumer: ConsumerGroupStream;
  let onMessageCallback: (message: object | object[]) => Promise<void>;

  beforeEach(function() {
    // disable logging
    sandbox.stub(logger);

    kafkaProducer = {} as Producer;
    kafkaProducer.send = sandbox.stub();
    (kafkaProducer.send as any).callsFake((payloads: any, cb: any) => cb());

    dispatcher = new KafkaEnrichmentDispatcher('test', kafkaProducer, 'test', logger);

    kafkaConsumer = new Readable() as ConsumerGroupStream;
    kafkaConsumer.read = sandbox.stub();
    kafkaConsumer.commit = sandbox.stub();

    kafkaDlqProducer = {} as Producer;
    kafkaDlqProducer.send = sandbox.stub();
    (kafkaDlqProducer.send as any).callsFake((payloads: any, cb: any) => cb());

    dlqDispatcher = new KafkaEnrichmentDispatcher('test', kafkaProducer, 'test', logger);

    consumer = new KafkaEnrichmentConsumer('test', kafkaConsumer, dlqDispatcher, logger);
  });
  afterEach(function() {
    sandbox.restore();
  });

  describe('KafkaEnrichmentDispatcher', function() {
    it('should call send function on producer passed to it', async function() {
      await dispatcher.send([{} as EnrichmentOutput<'alert'>]);
      expect((kafkaProducer.send as any).calledOnce).to.be.true;
    });
    it('should retry `send` function 2 times before rethrowing the error', async function() {
      (kafkaProducer as any).send.throws();
      try {
        await dispatcher.send([{} as EnrichmentOutput<'alert'>]);
      } catch (e) {
        expect((kafkaProducer.send as any).callCount).to.be.eq(3);
        return;
      }
      throw Error('No exception thrown');
    });
  });
  // TODO: the unit testing of the consumer is stuck.
  // reason being is that when we set a listener on any event in the `kafkaConsumer` readable stream,
  // it gets stuck. The test gets stuck because it is waiting for the stream to close all of its related resources.
  // It looks like even when calling `destroy` and `removeAllListeners` it wont be enough for mocha to realize that
  // there is no more resources to clean.
  // Need to find a way to perform the tests on the stream and being able to finish the test afterwards.
  // There is an option to just call the mocha tests with --exit flag, but it does'nt feel right solution...
  // describe('KafkaEnrichmentConsumer', function() {
  //   it('should subscribe to data event', function() {
  //     onMessageCallback = sandbox.stub();
  //     kafkaConsumer.on('data', function(data) {
  //       console.log(data);
  //     })
  //     // consumer.start(onMessageCallback);
  //     expect(kafkaConsumer.listenerCount('data')).to.be.eq(1);
  //   });
  // });
});
