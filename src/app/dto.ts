/**
 * DTO - Data Transfer Object, DTO is an object that we use to interact with
 * different clients, in our case, its the json objects that we receive from post requests.
 * This file holds the definitions for the DTOs that we use.
 * This file holds the functions that translate the DTO to a `core` object (our entity).
 */

import { Alert, Severity } from '../core/alert';
import { Hermeticity, HermeticityStatus } from '../core/hermeticity';

export interface EnrichmentReceived {
  /**
   * @format date-time
   */
  timestamp: string;
  /**
   * @minLength 1
   */
  origin: string;
}

export interface HermeticityReceived extends EnrichmentReceived {
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

export interface AlertReceived extends EnrichmentReceived {
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

export function ReceivedAlertToDomain(dto: AlertReceived): Alert {
  return new Alert({
    operator: dto.operator,
    application: dto.application,
    object: dto.object,
    description: dto.description,
    severity: dto.severity,
    node: dto.node,
    origin: dto.origin,
    timestampCreated: new Date(dto.timestamp),
    timestampReceived: new Date()
  });
}

export function ReceivedHermeticityToDomain(dto: HermeticityReceived): Hermeticity {
  return new Hermeticity({
    timestampReceived: new Date(),
    timestampCreated: new Date(dto.timestamp),
    origin: dto.origin,
    beakID: dto.beakID,
    status: dto.status,
    value: dto.value
  });
}
