import { Enrichment } from './enrichment';

export interface EnrichmentDispatcher {
  send(enrichment: Enrichment): Promise<void>;
}
