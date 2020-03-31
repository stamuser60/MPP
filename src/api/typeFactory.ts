import { alertSchema, hermeticitySchema } from './schemaGenerator';
import { Definition } from 'typescript-json-schema';
import { EnrichmentType } from '../app/app';

export const TypeToValidation: { [key in EnrichmentType]: Definition } = {
  hermeticity: hermeticitySchema as Definition,
  alert: alertSchema as Definition
};

export function validateEnrichmentType(type: string): void {
  if (!Object.keys(TypeToValidation).some(value => value === type)) {
    throw Error(`Enrichment type ${type} was not found, options are ${Object.keys(TypeToValidation).join(', ')}`);
  }
}
