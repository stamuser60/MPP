import { createEnrichmentOutput, EnrichmentOutput, EnrichmentOutputProps, EnrichmentType } from './enrichment';

export enum HermeticityStatus {
  normal = 1,
  minor = 2,
  critical = 3
}

export interface HermeticityOutput extends EnrichmentOutput {
  value: number;
  beakID: string;
  status: keyof typeof HermeticityStatus;
  hasAlert: boolean;
  type: EnrichmentType.hermeticity;
}

export interface HermeticityOutputProps extends EnrichmentOutputProps {
  value: number;
  beakID: string;
  status: keyof typeof HermeticityStatus;
  hasAlert: boolean;
}

export function createHermeticityOutput(props: HermeticityOutputProps): HermeticityOutput {
  return {
    ...createEnrichmentOutput(props, EnrichmentType.hermeticity),
    value: props.value,
    beakID: props.beakID,
    status: props.status,
    hasAlert: props.hasAlert,
    type: EnrichmentType.hermeticity
  };
}
