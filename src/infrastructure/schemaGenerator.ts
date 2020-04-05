/**
 * Defines the json schema for each enrichment type
 */

import { resolve } from 'path';
import * as TJS from 'typescript-json-schema';
import { Definition, PartialArgs } from 'typescript-json-schema';

function modifySchema(schema: Definition): void {
  schema.additionalProperties = false;
}

const program = TJS.getProgramFromFiles([
  resolve('src/core/alert.ts'),
  resolve('src/core/enrichment.ts'),
  resolve('src/core/hermeticity.ts'),
  resolve('src/app/dto.ts')
]);

const generateArgs: PartialArgs = {
  required: true
};

export const hermeticitySchema = TJS.generateSchema(program, 'HermeticityReceived', generateArgs);
export const alertSchema = TJS.generateSchema(program, 'AlertReceived', generateArgs);

if (!hermeticitySchema) {
  throw Error('Could not find hermeticity schema');
}
if (!alertSchema) {
  throw Error('Could not find alert schema');
}
modifySchema(hermeticitySchema);
modifySchema(alertSchema);
