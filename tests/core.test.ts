import { createEnrichmentOutput } from '../src/core/enrichment';
import { expect } from 'chai';
import { createAlertOutput } from '../src/core/alert';
import { createHermeticityOutput } from '../src/core/hermeticity';
import {
  alertOutputProps,
  enrichmentProps1,
  enrichmentProps2,
  futureEnrichmentProps,
  hermeticityOutputProps
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
} from './config';

describe('Core', function() {
  describe('Enrichment', function() {
    it('should create two different enrichments with different ID if same data is passed', function() {
      const enrichment1 = createEnrichmentOutput(enrichmentProps1, 'alert');
      const enrichment2 = createEnrichmentOutput(enrichmentProps1, 'alert');
      expect(enrichment1.ID === enrichment2.ID).to.eq(false);
    });
    it('should create two different enrichments with different ID if different data is passed', function() {
      const enrichment1 = createEnrichmentOutput(enrichmentProps1, 'alert');
      const enrichment2 = createEnrichmentOutput(enrichmentProps2, 'alert');
      expect(enrichment1.ID === enrichment2.ID).to.eq(false);
    });
    it('should create object if props are fine', function() {
      createEnrichmentOutput(enrichmentProps1, 'alert');
    });
    it('should throw exception when timestampCreated is older than current time', function(done) {
      try {
        createEnrichmentOutput(futureEnrichmentProps, 'alert');
        done('No error thrown for older `timestampReceived` than `timestampCreated`');
      } catch (e) {
        done();
      }
    });
    it('should be able to get run JSON.stringify on enrichment object', function() {
      JSON.stringify(createEnrichmentOutput(enrichmentProps1, 'test'));
    });
  });
  describe('Alert', function() {
    it('should be able to get run JSON.stringify on alert object', function() {
      JSON.stringify(createAlertOutput(alertOutputProps));
    });
    it(`should create alert objects with type key equal to 'alert'`, function() {
      const enrichment = createAlertOutput(alertOutputProps);
      expect(enrichment.type).to.be.eq('alert');
    });
  });
  describe('Hermeticity', function() {
    it(`should create hermeticity objects with type key equal to 'hermeticity'`, function() {
      const enrichment = createHermeticityOutput(hermeticityOutputProps);
      expect(enrichment.type).to.be.eq('hermeticity');
    });
    it('should be able to get run JSON.stringify on hermeticity object', function() {
      JSON.stringify(createHermeticityOutput(hermeticityOutputProps));
    });
  });
});
