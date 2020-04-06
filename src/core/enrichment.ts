import * as shortid from 'shortid';

export enum EnrichmentType {
  hermeticity = 'hermeticity',
  alert = 'alert'
}

export interface EnrichmentProps {
  timestampCreated: Date;
  timestampReceived: Date;
  origin: string;
}

abstract class JSONStringifiable {
  abstract toJSON(): { [key: string]: unknown };
}

export class Enrichment extends JSONStringifiable {
  public ID: string;
  public timestampCreated: Date;
  public timestampReceived: Date;
  public origin: string;
  public type: keyof typeof EnrichmentType;

  constructor(props: EnrichmentProps, type: keyof typeof EnrichmentType) {
    super();
    this.validate(props);
    this.type = type;
    this.ID = shortid.generate();
    this.timestampCreated = props.timestampCreated;
    this.timestampReceived = props.timestampReceived;
    this.origin = props.origin;
  }

  private validate(props: EnrichmentProps): void {
    if (props.timestampReceived.getTime() < props.timestampCreated.getTime()) {
      throw Error(`'timestampReceived' cannot be earlier than 'timestamp' in ${JSON.stringify(props, null, 2)}`);
    }
  }

  toJSON(): { [key: string]: unknown } {
    return {
      type: this.type,
      ID: this.ID,
      timestampCreated: this.timestampCreated.toISOString(),
      timestampReceived: this.timestampReceived.toISOString(),
      origin: this.origin
    };
  }
}
