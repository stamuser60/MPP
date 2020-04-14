import md5 from 'md5';

export interface EnrichmentOutput<T extends string> {
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
    throw Error(
      `'timestampCreated' cannot be future, got ${tsCreated} as 'timestampCreated' while ${tsCreated} is the current time`
    );
  }
}

/**
 * A function that generates a unique hash based on json passed.
 * @param uniqueData: The data we use to generate the MD5 hash.
 *                    Another place where we have to use `any` because the typescript compiler
 *                    is not able to tell that we are passing sufficient data.
 */
function generateMD5UniqueID(uniqueData: { [key: string]: any }): string {
  return md5(JSON.stringify(uniqueData));
}

export function createEnrichmentOutput<T extends string>(props: EnrichmentOutputProps, type: T): EnrichmentOutput<T> {
  const timestampReceived = new Date();
  const timestampCreated = new Date(props.timestampCreated);
  validate(timestampCreated, timestampReceived);
  return {
    ID: generateMD5UniqueID(props),
    origin: props.origin,
    timestampCreated: timestampCreated,
    type: type
  };
}
