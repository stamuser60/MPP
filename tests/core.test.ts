import { Enrichment, EnrichmentProps } from '../src/core/enrichment';
import { expect } from 'chai';

describe('Core', function() {
  describe('Enrichment', function() {
    it("should create enrichment with different ID'", function() {
      const timestampReceived = new Date('2020-03-26T12:24:23.319Z');
      const timestamp = new Date('2020-03-25T12:24:23.319Z');
      const enrichmentProps: EnrichmentProps = {
        origin: 'asd',
        timestamp: timestamp,
        timestampReceived: timestampReceived
      };
      const enrichment1 = new Enrichment(enrichmentProps);
      const enrichment2 = new Enrichment(enrichmentProps);
      expect(enrichment1.ID.id === enrichment2.ID.id).to.be.false;
    });
    it('should create object if props are fine', function() {
      const timestampReceived = new Date('2020-03-26T12:24:23.319Z');
      const timestamp = new Date('2020-03-25T12:24:23.319Z');
      const enrichmentProps: EnrichmentProps = {
        origin: 'asd',
        timestamp: timestamp,
        timestampReceived: timestampReceived
      };
      new Enrichment(enrichmentProps);
    });
    it('should throw exception when timestamp is older than timestampReceived', function(done) {
      const timestampReceived = new Date('2020-03-25T12:24:23.319Z');
      const timestamp = new Date('2020-03-26T12:24:23.319Z');
      const enrichmentProps: EnrichmentProps = {
        origin: 'asd',
        timestamp: timestamp,
        timestampReceived: timestampReceived
      };
      try {
        new Enrichment(enrichmentProps);
        done('No error thrown for older `timestampReceived` than `timestamp`');
      } catch (e) {
        done();
      }
    });
  });
});
