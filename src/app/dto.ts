/**
 * DTO - Data Transfer Object, DTO is an object that we use to interact with
 * different clients, in our case, its the json objects that we receive from post requests.
 * This file holds the definitions for the DTOs that we use.
 * This file holds the functions that translate the DTO to a `core` object (our entity).
 */

import { AlertOutput, AlertOutputProps, createAlertOutput, Severity } from '../core/alert';
import {
  createHermeticityOutput,
  HermeticityOutput,
  HermeticityOutputProps,
  HermeticityStatus
} from '../core/hermeticity';

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
  hasAlert: boolean;
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

export function ReceivedAlertToDomain(dto: AlertReceived): AlertOutput {
  const props: AlertOutputProps = {
    ...dto,
    timestampCreated: dto.timestamp
  };
  return createAlertOutput(props);
}

export function ReceivedHermeticityToDomain(dto: HermeticityReceived): HermeticityOutput {
  const props: HermeticityOutputProps = {
    ...dto,
    status: HermeticityStatus[dto.status] as keyof typeof HermeticityStatus,
    timestampCreated: dto.timestamp
  };
  return createHermeticityOutput(props);
}
