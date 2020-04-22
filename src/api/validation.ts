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

const schemaValidator = new Validator();
const jsonSchemaOptions = { throwError: true };

function validateSingleEnrichment<T extends TypeName>(type: T, msg: unknown): TypeToEnrichmentReceived[T] {
  const schema = TypeToSchema[type];
  try {
    schemaValidator.validate(msg, schema, jsonSchemaOptions);
  } catch (e) {
    throw new AppError(e.toString(), 422);
  }
  return msg as TypeToEnrichmentReceived[T];
}

function validateMultipleEnrichments<T extends TypeName>(type: T, msgs: unknown[]): TypeToEnrichmentReceived[T][] {
  const schema = TypeToSchema[type];
  return msgs.map(function(msg, index) {
    try {
      schemaValidator.validate(msg, schema, jsonSchemaOptions);
      return msg as TypeToEnrichmentReceived[T];
    } catch (e) {
      if (msgs.length === 1) {
        throw new AppError(e.toString(), 422);
      }
      throw new AppError(`The ${index + 1}'s document is problematic: ${e.toString()}`, 422);
    }
  });
}

export function validateEnrichmentsReceived<T extends TypeName>(
  type: T,
  value: object | object[]
): TypeToEnrichmentReceived[T][] {
  let enrichmentsReceived;
  if (Array.isArray(value)) {
    enrichmentsReceived = validateMultipleEnrichments(type, value);
  } else {
    enrichmentsReceived = [validateSingleEnrichment(type, value)];
  }
  return enrichmentsReceived as TypeToEnrichmentReceived[T][];
}
