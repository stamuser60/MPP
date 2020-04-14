import { alertSchema, hermeticitySchema } from '../infrastructure/schemaGenerator';
import { Schema, Validator } from 'jsonschema';
import { TypeToEnrichmentReceived } from '../app/dto';
import { hermeticityTypeName } from '../core/hermeticity';
import { alertTypeName } from '../core/alert';
import { TypeName } from '../core/types';

export const TypeToSchema: { [key in TypeName]: Schema } = {
  [hermeticityTypeName]: hermeticitySchema as Schema,
  [alertTypeName]: alertSchema as Schema
};

export function validateEnrichmentType(type: string): TypeName {
  if (!Object.keys(TypeToSchema).some(value => value === type)) {
    throw Error(`Enrichment type ${type} was not found, options are: ${Object.keys(TypeToSchema).join(', ')}`);
  }
  return type as TypeName;
}

export function validateEnrichment<T extends TypeName>(type: T, msg: unknown): TypeToEnrichmentReceived[T] {
  const newNodeValidator = new Validator();
  const jsonSchemaOptions = { throwError: true };
  const schema = TypeToSchema[type];
  newNodeValidator.validate(msg, schema, jsonSchemaOptions);
  return msg as TypeToEnrichmentReceived[T];
}
