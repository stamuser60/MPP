/**
 * Defines the use cases for the service.
 */

import { EnrichmentDispatcher } from '../core/enrichmentDispatcher';
import { TypeToEnrichmentReceived, TypeReceivedName, TypeReceivedToTypeOutputName } from './dto';
import { TypeToEnrichmentOutput } from '../core/types';
import { ReceivedAlertToDomain, ReceivedHermeticityToDomain } from './mapper';
import { alertTypeName } from '../core/alert';
import { hermeticityTypeName } from '../core/hermeticity';

/**
 * Represents the enrichment output that is connected to the enrichment received by the
 * mapping of the names from `TypeReceivedToTypeOutputName`
 */
type EnrichmentOutputByReceivedName<
  T extends TypeReceivedName
> = TypeToEnrichmentOutput[TypeReceivedToTypeOutputName[T]];

/**
 * Represents the mapping from a certain type of received enrichment to the mapping function
 * that maps that received enrichment to the enrichment output it is connected to.
 */
type TypeToMapper = {
  [P in TypeReceivedName]: (dto: TypeToEnrichmentReceived[P]) => EnrichmentOutputByReceivedName<P>;
};

export const TypeToMapper: TypeToMapper = {
  [alertTypeName]: ReceivedAlertToDomain,
  [hermeticityTypeName]: ReceivedHermeticityToDomain
};

function enrichmentFactory<T extends TypeReceivedName>(
  type: T,
  msg: TypeToEnrichmentReceived[T]
): EnrichmentOutputByReceivedName<T> {
  // unfortunately, we have to use `any` type here so that typescript will not throw any error,
  // reason being is that the compiler (ATM of writing this code) is not 'smart' enough to understand that
  // the type of the mapper function is narrowed, to the right type
  const mapper = TypeToMapper[type] as any;
  return mapper(msg);
}

export async function sendEnrichment<T extends TypeReceivedName>(
  type: T,
  msg: TypeToEnrichmentReceived[T],
  msgDispatcher: EnrichmentDispatcher
): Promise<void> {
  const enrichment = enrichmentFactory(type, msg);
  await msgDispatcher.send(enrichment);
}
