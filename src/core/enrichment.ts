import shortid = require('shortid');

export enum EnrichmentType {
  hermeticity = 'hermeticity',
  alert = 'alert'
}

export interface EnrichmentOutput {
  timestampCreated: Date;
  origin: string;
  ID: string;
  type: EnrichmentType;
}

export interface EnrichmentOutputProps {
  timestampCreated: string;
  origin: string;
}

function validate(tsCreated: Date, tsReceived: Date): void {
  if (tsReceived < tsCreated) {
    throw Error(
      `'timestampCreated' cannot be future, got ${tsCreated} as 'timestampCreated' while ${tsCreated} is the current time`
    );
  }
}

export function createEnrichmentOutput(props: EnrichmentOutputProps, type: EnrichmentType): EnrichmentOutput {
  const timestampReceived = new Date();
  const timestampCreated = new Date(props.timestampCreated);
  validate(timestampCreated, timestampReceived);
  return {
    ID: shortid.generate(),
    origin: props.origin,
    timestampCreated: timestampCreated,
    type: type
  };
}
