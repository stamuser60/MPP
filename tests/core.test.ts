import { createEnrichmentOutput, EnrichmentOutputProps } from '../src/core/enrichment';
import { expect } from 'chai';

describe('Core', function() {
  describe('Enrichment', function() {
    it('should create two different enrichments with same ID if same data is passed', function() {
      const timestamp = '2020-03-25T12:24:23.319Z';
      const enrichmentProps: EnrichmentOutputProps = {
        origin: 'asd',
        timestampCreated: timestamp
      };
      const enrichment1 = createEnrichmentOutput(enrichmentProps, 'alert');
      const enrichment2 = createEnrichmentOutput(enrichmentProps, 'alert');
      expect(enrichment1.ID === enrichment2.ID).to.eq(true);
    });
    it('should create two different enrichments with different ID if different data is passed', function() {
      const timestamp = '2020-03-25T12:24:23.319Z';
      const enrichmentProps1: EnrichmentOutputProps = {
        origin: 'asd',
        timestampCreated: timestamp
      };
      const enrichmentProps2: EnrichmentOutputProps = {
        origin: 'asdd',
        timestampCreated: timestamp
      };
      const enrichment1 = createEnrichmentOutput(enrichmentProps1, 'alert');
      const enrichment2 = createEnrichmentOutput(enrichmentProps2, 'alert');
      expect(enrichment1.ID === enrichment2.ID).to.eq(false);
    });
    it('should create object if props are fine', function() {
      const timestamp = '2020-03-25T12:24:23.319Z';
      const enrichmentProps: EnrichmentOutputProps = {
        origin: 'asd',
        timestampCreated: timestamp
      };
      createEnrichmentOutput(enrichmentProps, 'alert');
    });
    it('should throw exception when timestampCreated is older than timestampReceived', function(done) {
      const timestamp = '2099-03-26T12:24:23.319Z';
      const enrichmentProps: EnrichmentOutputProps = {
        origin: 'asd',
        timestampCreated: timestamp
      };
      try {
        createEnrichmentOutput(enrichmentProps, 'alert');
        done('No error thrown for older `timestampReceived` than `timestampCreated`');
      } catch (e) {
        done();
      }
    });
  });
});
