import { AlertReceived, HermeticityReceived } from './dto';
import { AlertOutput, AlertOutputProps, createAlertOutput } from '../core/alert';
import {
  createHermeticityOutput,
  HermeticityOutput,
  HermeticityOutputProps,
  HermeticityStatus
} from '../core/hermeticity';

export function receivedAlertToDomain(dto: AlertReceived): AlertOutput {
  const props: AlertOutputProps = {
    ...dto,
    timestampCreated: dto.timestamp
  };
  return createAlertOutput(props);
}

export function receivedHermeticityToDomain(dto: HermeticityReceived): HermeticityOutput {
  const props: HermeticityOutputProps = {
    ...dto,
    status: HermeticityStatus[dto.status] as keyof typeof HermeticityStatus,
    timestampCreated: dto.timestamp
  };
  return createHermeticityOutput(props);
}
