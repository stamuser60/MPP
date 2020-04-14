import { EnrichmentOutput } from './enrichment';
import { TypeName } from './types';

export interface EnrichmentDispatcher {
  send(enrichment: EnrichmentOutput<TypeName>): Promise<void>;
}
