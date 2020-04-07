import { EnrichmentOutput } from './enrichment';

export interface EnrichmentDispatcher {
  send(enrichment: EnrichmentOutput): Promise<void>;
}
