import { HermeticityOutput, hermeticityTypeName } from './hermeticity';
import { AlertOutput, alertTypeName } from './alert';

export interface TypeToEnrichmentOutput {
  [hermeticityTypeName]: HermeticityOutput;
  [alertTypeName]: AlertOutput;
}

export type TypeName = keyof TypeToEnrichmentOutput;
