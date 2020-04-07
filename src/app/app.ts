/**
 * Defines the use cases for the service.
 */

import { EnrichmentDispatcher } from '../core/enrichmentDispatcher';
import { EnrichmentOutput, EnrichmentType } from '../core/enrichment';
import {
  AlertReceived,
  ReceivedAlertToDomain,
  ReceivedHermeticityToDomain,
  EnrichmentReceived,
  HermeticityReceived
} from './dto';

function enrichmentFactory(type: EnrichmentType, enrichmentDTO: EnrichmentReceived): EnrichmentOutput {
  switch (type) {
    case 'alert':
      return ReceivedAlertToDomain(enrichmentDTO as AlertReceived);
    case 'hermeticity':
      return ReceivedHermeticityToDomain(enrichmentDTO as HermeticityReceived);
    default:
      throw Error(`No constructor found for ${type}`);
  }
}

export async function sendEnrichment(
  type: EnrichmentType,
  msg: EnrichmentReceived,
  msgDispatcher: EnrichmentDispatcher
): Promise<void> {
  const enrichment = enrichmentFactory(type, msg);
  await msgDispatcher.send(enrichment);
}
