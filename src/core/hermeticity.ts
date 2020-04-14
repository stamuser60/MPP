import { createEnrichmentOutput, EnrichmentOutput, EnrichmentOutputProps } from './enrichment';

export enum HermeticityStatus {
  normal = 1,
  minor = 2,
  critical = 3
}

export const hermeticityTypeName = 'hermeticity';
export interface HermeticityOutput extends EnrichmentOutput<typeof hermeticityTypeName> {
  value: number;
  beakID: string;
  status: keyof typeof HermeticityStatus;
  hasAlert: boolean;
}

export interface HermeticityOutputProps extends EnrichmentOutputProps {
  value: number;
  beakID: string;
  status: keyof typeof HermeticityStatus;
  hasAlert: boolean;
}

export function createHermeticityOutput(props: HermeticityOutputProps): HermeticityOutput {
  return {
    ...createEnrichmentOutput(props, hermeticityTypeName),
    value: props.value,
    beakID: props.beakID,
    status: props.status,
    hasAlert: props.hasAlert
  };
}
