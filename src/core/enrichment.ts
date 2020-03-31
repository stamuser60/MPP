import * as shortid from 'shortid';

export class ID {
  public id: string;

  constructor() {
    this.id = shortid.generate();
  }
}

export interface EnrichmentProps {
  timestamp: Date;
  timestampReceived: Date;
  origin: string;
}

export class Enrichment {
  public ID: ID;
  public timestamp: Date;
  public timestampReceived: Date;
  public origin: string;

  constructor(props: EnrichmentProps) {
    this.validate(props);
    this.ID = new ID();
    this.timestamp = props.timestamp;
    this.timestampReceived = props.timestampReceived;
    this.origin = props.origin;
  }

  private validate(props: EnrichmentProps): void {
    if (props.timestampReceived.getTime() < props.timestamp.getTime()) {
      throw Error(`'timestampReceived' cannot be earlier than 'timestamp' in ${JSON.stringify(props, null, 2)}`);
    }
  }
}
