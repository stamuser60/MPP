import { MsgDispatcher } from '../core/msgDispatcher';
import { Enrichment } from '../core/enrichment';
import { AlertDTO, DTOAlertToDomain, DTOHermeticityToDomain, EnrichmentDTO, HermeticityDTO } from './dto';

export enum EnrichmentType {
  hermeticity = 'hermeticity',
  alert = 'alert'
}

function enrichmentFactory(type: EnrichmentType, enrichmentDTO: EnrichmentDTO): Enrichment {
  switch (type) {
    case 'alert':
      return DTOAlertToDomain(enrichmentDTO as AlertDTO);
    case 'hermeticity':
      return DTOHermeticityToDomain(enrichmentDTO as HermeticityDTO);
    default:
      throw Error(`No constructor found for ${type}`);
  }
}

export async function sendEnrichment(
  type: EnrichmentType,
  msg: EnrichmentDTO,
  msgDispatcher: MsgDispatcher
): Promise<void> {
  const enrichment = enrichmentFactory(type, msg);
  await msgDispatcher.send(enrichment);
}
