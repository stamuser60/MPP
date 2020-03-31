import { Enrichment, EnrichmentProps } from './enrichment';

export enum HermeticityStatus {
  normal = 'normal',
  minor = 'minor',
  critical = 'critical'
}

export interface HermeticityProps extends EnrichmentProps {
  value: number;
  beakID: string;
  status: HermeticityStatus;
}

export class Hermeticity extends Enrichment {
  public value: number;
  public beakID: string;
  public status: HermeticityStatus;

  constructor(props: HermeticityProps) {
    super(props);
    this.status = props.status;
    this.value = props.value;
    this.beakID = props.beakID;
  }
}
