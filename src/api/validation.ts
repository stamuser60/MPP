import { alertSchema, hermeticitySchema } from '../infrastructure/schemaGenerator';
import { Definition } from 'typescript-json-schema';
import { EnrichmentType } from '../app/app';
import { Schema, Validator } from 'jsonschema';

export const TypeToValidation: { [key in EnrichmentType]: Definition } = {
  hermeticity: hermeticitySchema as Definition,
  alert: alertSchema as Definition
};

export function validateEnrichmentType(type: string): void {
  if (!Object.keys(TypeToValidation).some(value => value === type)) {
    throw Error(`Enrichment type ${type} was not found, options are: ${Object.keys(TypeToValidation).join(', ')}`);
  }
}

export function validateEnrichment(type: EnrichmentType, msg: object): void {
  const newNodeValidator = new Validator();
  const jsonSchemaOptions = { throwError: true };
  const schema = TypeToValidation[type as EnrichmentType];
  newNodeValidator.validate(msg, schema as Schema, jsonSchemaOptions);
}
