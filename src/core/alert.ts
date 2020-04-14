import { createEnrichmentOutput, EnrichmentOutput, EnrichmentOutputProps } from './enrichment';

export enum Severity {
  normal = 'normal',
  warning = 'warning',
  minor = 'minor',
  major = 'major',
  critical = 'critical'
}

export const alertTypeName = 'alert';
export interface AlertOutput extends EnrichmentOutput<typeof alertTypeName> {
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
    ...createEnrichmentOutput(props, alertTypeName),
    node: props.node,
    severity: props.severity,
    description: props.description,
    object: props.object,
    application: props.application,
    operator: props.operator
  };
}
