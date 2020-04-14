/**
 * DTO - Data Transfer Object, DTO is an object that we use to interact with
 * different clients, in our case, its the json objects that we receive from post requests.
 * This file holds the definitions for the DTOs that we use.
 * This file holds the functions that translate the DTO to a `core` object (our entity).
 */

import { alertTypeName, Severity } from '../core/alert';
import { HermeticityStatus, hermeticityTypeName } from '../core/hermeticity';

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

/**
 * Mapping between the name of the enrichment received to the enrichment dto
 */
export interface TypeToEnrichmentReceived {
  [alertTypeName]: AlertReceived;
  [hermeticityTypeName]: HermeticityReceived;
}

export type TypeReceivedName = keyof TypeToEnrichmentReceived;

/**
 * Mapping between the name of the enrichment received to the name of the enrichment output
 */
export interface TypeReceivedToTypeOutputName {
  [alertTypeName]: typeof alertTypeName;
  [hermeticityTypeName]: typeof hermeticityTypeName;
}
