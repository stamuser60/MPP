import { alertSchema, hermeticitySchema } from '../infrastructure/schemaGenerator';
import { Schema, Validator } from 'jsonschema';
import { TypeToEnrichmentReceived } from '../app/dto';
import { hermeticityTypeName } from '../core/hermeticity';
import { alertTypeName } from '../core/alert';
import { TypeName } from '../core/types';
import { AppError } from '../core/exc';

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
  try {
    newNodeValidator.validate(msg, schema, jsonSchemaOptions);
  } catch (e) {
    throw new AppError(e.toString(), 422);
  }
  return msg as TypeToEnrichmentReceived[T];
}
