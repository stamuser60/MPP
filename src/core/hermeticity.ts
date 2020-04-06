import { Enrichment, EnrichmentProps, EnrichmentType } from './enrichment';

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
    super(props, EnrichmentType.hermeticity);
    this.status = props.status;
    this.value = props.value;
    this.beakID = props.beakID;
  }

  toJSON(): { [key: string]: unknown } {
    return {
      ...super.toJSON(),
      value: this.value,
      beakID: this.beakID,
      status: this.status
    };
  }
}
