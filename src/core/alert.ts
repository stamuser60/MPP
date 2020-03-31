import { Enrichment, EnrichmentProps } from './enrichment';

export interface AlertProps extends EnrichmentProps {
  node: string;
  severity: Severity;
  description: string;
  object: string;
  application: string;
  operator: string;
}

export enum Severity {
  NORMAL = 'normal',
  WARNING = 'warning',
  MINOR = 'minor',
  MAJOR = 'major',
  CRITICAL = 'critical'
}

export class Alert extends Enrichment {
  public node: string;
  public severity: Severity;
  public description: string;
  public object: string;
  public application: string;
  public operator: string;

  constructor(props: AlertProps) {
    super(props);
    this.node = props.node;
    this.severity = props.severity;
    this.description = props.description;
    this.object = props.object;
    this.application = props.application;
    this.operator = props.operator;
  }
}
