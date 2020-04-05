import * as shortid from 'shortid';

export interface EnrichmentProps {
  timestamp: Date;
  timestampReceived: Date;
  origin: string;
}

abstract class JSONStringifiable {
  abstract toJSON(): { [key: string]: unknown };
}

export class Enrichment extends JSONStringifiable {
  public ID: string;
  public timestamp: Date;
  public timestampReceived: Date;
  public origin: string;

  constructor(props: EnrichmentProps) {
    super();
    this.validate(props);
    this.ID = shortid.generate();
    this.timestamp = props.timestamp;
    this.timestampReceived = props.timestampReceived;
    this.origin = props.origin;
  }

  private validate(props: EnrichmentProps): void {
    if (props.timestampReceived.getTime() < props.timestamp.getTime()) {
      throw Error(`'timestampReceived' cannot be earlier than 'timestamp' in ${JSON.stringify(props, null, 2)}`);
    }
  }

  toJSON(): { [key: string]: unknown } {
    return {
      ID: this.ID,
      timestamp: this.timestamp.toISOString(),
      timestampReceived: this.timestampReceived.toISOString(),
      origin: this.origin
    };
  }
}
