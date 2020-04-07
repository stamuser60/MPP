import { createEnrichmentOutput, EnrichmentOutputProps, EnrichmentType } from '../src/core/enrichment';
import { expect } from 'chai';

describe('Core', function() {
  describe('Enrichment', function() {
    it("should create enrichment with different ID'", function() {
      const timestamp = '2020-03-25T12:24:23.319Z';
      const enrichmentProps: EnrichmentOutputProps = {
        origin: 'asd',
        timestampCreated: timestamp
      };
      const enrichment1 = createEnrichmentOutput(enrichmentProps, EnrichmentType.alert);
      const enrichment2 = createEnrichmentOutput(enrichmentProps, EnrichmentType.alert);
      expect(enrichment1.ID === enrichment2.ID).to.eq(false);
    });
    it('should create object if props are fine', function() {
      const timestamp = '2020-03-25T12:24:23.319Z';
      const enrichmentProps: EnrichmentOutputProps = {
        origin: 'asd',
        timestampCreated: timestamp
      };
      createEnrichmentOutput(enrichmentProps, EnrichmentType.alert);
    });
    it('should throw exception when timestampCreated is older than timestampReceived', function(done) {
      const timestamp = '2099-03-26T12:24:23.319Z';
      const enrichmentProps: EnrichmentOutputProps = {
        origin: 'asd',
        timestampCreated: timestamp
      };
      try {
        createEnrichmentOutput(enrichmentProps, EnrichmentType.alert);
        done('No error thrown for older `timestampReceived` than `timestampCreated`');
      } catch (e) {
        done();
      }
    });
  });
});
