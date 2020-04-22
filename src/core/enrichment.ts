import { v1 as uuidv1 } from 'uuid';
import { AppError } from './exc';

export interface EnrichmentOutput<T extends string> {
  timestampMPP: Date;
  timestampCreated: Date;
  origin: string;
  ID: string;
  type: T;
}

export interface EnrichmentOutputProps {
  timestampCreated: string;
  origin: string;
}

function validate(tsCreated: Date, tsReceived: Date): void {
  if (tsReceived < tsCreated) {
    throw new AppError(
      `'timestampCreated' cannot be future, got ${tsCreated} as 'timestampCreated' while ${tsCreated} is the current time`,
      422
    );
  }
}

export function createEnrichmentOutput<T extends string>(props: EnrichmentOutputProps, type: T): EnrichmentOutput<T> {
  const timestampNow = new Date();
  const timestampCreated = new Date(props.timestampCreated);
  validate(timestampCreated, timestampNow);
  return {
    ID: uuidv1(),
    origin: props.origin,
    timestampCreated: timestampCreated,
    timestampMPP: timestampNow,
    type: type
  };
}
