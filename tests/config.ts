import { EnrichmentOutputProps } from '../src/core/enrichment';
import { AlertOutputProps, Severity } from '../src/core/alert';
import { HermeticityOutputProps } from '../src/core/hermeticity';
import { AlertReceived, HermeticityReceived } from '../src/app/dto';

const timestamp = '2020-03-25T12:24:23.319Z';
const futureTimestamp = '2099-03-26T12:24:23.319Z';
export const enrichmentProps1: EnrichmentOutputProps = {
  origin: 'asd',
  timestampCreated: timestamp
};
export const enrichmentProps2: EnrichmentOutputProps = {
  origin: 'asdd',
  timestampCreated: timestamp
};
export const futureEnrichmentProps: EnrichmentOutputProps = {
  origin: 'asd',
  timestampCreated: futureTimestamp
};
export const alertOutputProps: AlertOutputProps = {
  ...enrichmentProps1,
  application: 'asd',
  description: 'asd',
  node: 'ffg',
  severity: Severity.critical,
  operator: 'asd',
  object: 'asd'
};
export const hermeticityOutputProps: HermeticityOutputProps = {
  ...enrichmentProps1,
  value: 1,
  status: 'critical',
  hasAlert: false,
  beakID: 'asdasd'
};
export const alertReceived: AlertReceived = {
  origin: 'asd',
  timestamp: timestamp,
  severity: Severity.critical,
  operator: 'asd',
  object: 'sdf',
  node: 'asd',
  description: 'asd',
  application: 'asd'
};
export const hermeticityReceived: HermeticityReceived = {
  timestamp: timestamp,
  origin: 'sd',
  value: 23,
  status: 1,
  hasAlert: false,
  beakID: 'sdf'
};
export const invalidStructureAlertReceived = {
  application: 'asd',
  description: 'asd',
  node: 'as',
  object: 'asd',
  operator: 'asd',
  origin: 'asd',
  timestamp: '2019-01-27T08:14:00.000Z'
};
export const invalidStructureHermeticityReceived = {
  timestamp: '2019-01-27T08:14:00.000Z',
  origin: 'df',
  beakID: 'asd',
  hasAlert: false,
  status: 2
};
