import { createEnrichmentOutput, EnrichmentOutput, EnrichmentOutputProps, EnrichmentType } from './enrichment';

export enum Severity {
  normal = 'normal',
  warning = 'warning',
  minor = 'minor',
  major = 'major',
  critical = 'critical'
}

export interface AlertOutput extends EnrichmentOutput {
  node: string;
  severity: Severity;
  description: string;
  object: string;
  application: string;
  operator: string;
}

export interface AlertOutputProps extends EnrichmentOutputProps {
  node: string;
  severity: Severity;
  description: string;
  object: string;
  application: string;
  operator: string;
}

export function createAlertOutput(props: AlertOutputProps): AlertOutput {
  return {
    ...createEnrichmentOutput(props, EnrichmentType.alert),
    node: props.node,
    severity: props.severity,
    description: props.description,
    object: props.object,
    application: props.application,
    operator: props.operator
  };
}
