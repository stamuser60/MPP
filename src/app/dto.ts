import { Alert, Severity } from '../core/alert';
import { Hermeticity, HermeticityStatus } from '../core/hermeticity';

export interface EnrichmentDTO {
  /**
   * @format date-time
   */
  timestamp: string;
  /**
   * @minLength 1
   */
  origin: string;
}

export interface HermeticityDTO extends EnrichmentDTO {
  status: HermeticityStatus;
  /**
   * @minimum 0
   * @maximum 100
   */
  value: number;
  /**
   * @minLength 1
   */
  beakID: string;
}

export interface AlertDTO extends EnrichmentDTO {
  /**
   * @minLength 1
   */
  node: string;
  severity: Severity;
  /**
   * @minLength 1
   */
  description: string;
  /**
   * @minLength 1
   */
  object: string;
  /**
   * @minLength 1
   */
  application: string;
  /**
   * @minLength 1
   */
  operator: string;
}

export function DTOAlertToDomain(dto: AlertDTO): Alert {
  return new Alert({
    operator: dto.operator,
    application: dto.application,
    object: dto.object,
    description: dto.description,
    severity: dto.severity,
    node: dto.node,
    origin: dto.origin,
    timestamp: new Date(dto.timestamp),
    timestampReceived: new Date()
  });
}

export function DTOHermeticityToDomain(dto: HermeticityDTO): Hermeticity {
  return new Hermeticity({
    timestampReceived: new Date(),
    timestamp: new Date(dto.timestamp),
    origin: dto.origin,
    beakID: dto.beakID,
    status: dto.status,
    value: dto.value
  });
}
