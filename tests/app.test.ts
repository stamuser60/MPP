import sinon, { SinonSandbox } from 'sinon';
import { EnrichmentOutput } from '../src/core/enrichment';
import { expect } from 'chai';
import { AlertOutput } from '../src/core/alert';
import { receivedAlertToDomain, receivedHermeticityToDomain } from '../src/app/mapper';
import { sendEnrichment } from '../src/app/app';
import { HermeticityOutput } from '../src/core/hermeticity';
import { EnrichmentDispatcher } from '../src/core/enrichmentDispatcher';
import logger from '../src/logger';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { alertReceived, hermeticityReceived } from './config';

export const isOfType = <T>(varToBeChecked: any, propertyToCheckFor: (keyof T)[]): varToBeChecked is T => {
  for (const prop of propertyToCheckFor) {
    if ((varToBeChecked as T)[prop] === undefined) {
      return false;
    }
  }
  return true;
};

function isEnrichmentOutput(obj: object): obj is EnrichmentOutput<string> {
  return isOfType<EnrichmentOutput<string>>(obj, ['timestampMPP', 'timestampCreated', 'origin', 'ID', 'type']);
}

function isAlertOutput(obj: object): obj is AlertOutput {
  if ((obj as any).type !== 'alert') {
    return false;
  }
  if (!isEnrichmentOutput(obj)) {
    return false;
  }
  return isOfType<AlertOutput>(obj, ['node', 'severity', 'description', 'object', 'application', 'operator']);
}

function isHermeticityOutput(obj: object): obj is HermeticityOutput {
  if ((obj as any).type !== 'hermeticity') {
    return false;
  }
  if (!isEnrichmentOutput(obj)) {
    return false;
  }
  return isOfType<HermeticityOutput>(obj, ['value', 'beakID', 'status', 'hasAlert']);
}

describe('App', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;
  let dispatcher: EnrichmentDispatcher;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
    dispatcher = {} as EnrichmentDispatcher;
    dispatcher.send = sandbox.stub();
  });
  afterEach(function() {
    sandbox.restore();
  });

  describe('Mappers', function() {
    describe('Alert received to output', function() {
      it('should return an AlertOutput object when data received is valid', function() {
        const domainAlert = receivedAlertToDomain(alertReceived);
        expect(isAlertOutput(domainAlert)).to.be.eq(true);
      });
    });
    describe('Hermeticity received to output', function() {
      it('should return an HermeticityOutput object when data received is valid', function() {
        const domainHermeticity = receivedHermeticityToDomain(hermeticityReceived);
        expect(isHermeticityOutput(domainHermeticity)).to.be.eq(true);
      });
    });
  });
  describe('sendEnrichment', function() {
    it('should call send function on enrichmentDispatcher passed to it', function() {
      sendEnrichment('alert', [alertReceived], dispatcher);
      expect((dispatcher.send as any).calledOnce).to.be.true;
    });
    it('should pass AlertOutput objects to send function if received AlertReceived objects', function() {
      sendEnrichment('alert', [alertReceived, alertReceived], dispatcher);
      const calledWith = (dispatcher.send as any).getCall(0).args[0];
      expect(Array.isArray(calledWith)).to.be.true;
      for (const obj of calledWith) {
        expect(isAlertOutput(obj)).to.be.true;
      }
    });
    it('should pass HermeticityOutput objects to send function if received HermeticityReceived objects', function() {
      sendEnrichment('hermeticity', [hermeticityReceived, hermeticityReceived], dispatcher);
      const calledWith = (dispatcher.send as any).getCall(0).args[0];
      expect(Array.isArray(calledWith)).to.be.true;
      for (const obj of calledWith) {
        expect(isHermeticityOutput(obj)).to.be.true;
      }
    });
  });
});
