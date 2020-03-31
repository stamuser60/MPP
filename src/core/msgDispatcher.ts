import { Enrichment } from './enrichment';

export interface MsgDispatcher {
  send(msg: Enrichment): Promise<void>;
}
