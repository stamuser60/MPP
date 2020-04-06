import { Enrichment, EnrichmentProps, EnrichmentType } from './enrichment';

export enum Severity {
  normal = 'normal',
  warning = 'warning',
  minor = 'minor',
  major = 'major',
  critical = 'critical'
}

export interface AlertProps extends EnrichmentProps {
  node: string;
  severity: Severity;
  description: string;
  object: string;
  application: string;
  operator: string;
}

export class Alert extends Enrichment {
  public node: string;
  public severity: Severity;
  public description: string;
  public object: string;
  public application: string;
  public operator: string;

  constructor(props: AlertProps) {
    super(props, EnrichmentType.alert);
    this.node = props.node;
    this.severity = props.severity;
    this.description = props.description;
    this.object = props.object;
    this.application = props.application;
    this.operator = props.operator;
  }

  toJSON(): { [key: string]: unknown } {
    return {
      ...super.toJSON(),
      node: this.node,
      severity: this.severity,
      description: this.description,
      object: this.object,
      application: this.application,
      operator: this.operator
    };
  }
}
