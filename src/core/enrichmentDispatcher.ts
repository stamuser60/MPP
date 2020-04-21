import { EnrichmentOutput } from './enrichment';
import { TypeName } from './types';

export interface EnrichmentDispatcher {
  send(enrichments: EnrichmentOutput<TypeName>[]): Promise<void>;
}
