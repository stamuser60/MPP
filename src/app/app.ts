/**
 * Defines the use cases for the service.
 */

import { EnrichmentDispatcher } from '../core/enrichmentDispatcher';
import { TypeToEnrichmentReceived } from './dto';
import { TypeToEnrichmentOutput, TypeName } from '../core/types';
import { ReceivedAlertToDomain, ReceivedHermeticityToDomain } from './mapper';
import { alertTypeName } from '../core/alert';
import { hermeticityTypeName } from '../core/hermeticity';

/**
 * Represents the mapping from a certain type of received enrichment to the mapping function
 * that maps that received enrichment to the enrichment output it is connected to.
 */
type TypeToMapper = {
  [P in TypeName]: (dto: TypeToEnrichmentReceived[P]) => TypeToEnrichmentOutput[P];
};

export const TypeToMapper: TypeToMapper = {
  [alertTypeName]: ReceivedAlertToDomain,
  [hermeticityTypeName]: ReceivedHermeticityToDomain
};

function enrichmentFactory<T extends TypeName>(type: T, msg: TypeToEnrichmentReceived[T]): TypeToEnrichmentOutput[T] {
  // unfortunately, we have to use `any` type here so that typescript will not throw any error,
  // reason being is that the compiler (ATM of writing this code) is not 'smart' enough to understand that
  // the type of the mapper function is narrowed, to the right type
  const mapper = TypeToMapper[type] as any;
  return mapper(msg);
}

export async function sendEnrichment<T extends TypeName>(
  type: T,
  enrichmentsReceived: TypeToEnrichmentReceived[T][],
  msgDispatcher: EnrichmentDispatcher
): Promise<void> {
  const enrichments = enrichmentsReceived.map(enrichmentReceived => {
    return enrichmentFactory(type, enrichmentReceived);
  });
  await msgDispatcher.send(enrichments);
}
