require('dotenv/config');
import { onMessage } from '../src/api/kafka';
import logger from '../src/logger';
import { Response } from 'superagent';
import sinon, { SinonSandbox } from 'sinon';
import { expect } from 'chai';
import request from 'supertest';
import app, { API_PREFIX_V1 } from '../src/server/server';
import * as core from 'express-serve-static-core';
import { enrichmentDispatcher } from '../src/compositionRoot';
import {
  alertReceived,
  hermeticityReceived,
  invalidStructureAlertReceived,
  invalidStructureHermeticityReceived
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
} from './config';
import { EnrichmentDispatcher } from '../src/core/enrichmentDispatcher';
import { AppError, DispatchError } from '../src/core/exc';

function postToApp(app: core.Express, path: string, data: object): Promise<Response> {
  return request(app)
    .post(`${API_PREFIX_V1}${path}`)
    .send(data);
}

describe('api', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;
  let dispatcher: EnrichmentDispatcher;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
    // disable dispatching
    dispatcher = sandbox.stub(enrichmentDispatcher);
  });
  afterEach(function() {
    sandbox.restore();
  });

  describe('/swagger', function() {
    it('should return OK status', function() {
      return request(app)
        .get('/swagger')
        .then(function(response) {
          expect(response.status).to.be.oneOf([200, 301]);
        });
    });
  });
  describe('/enrichments', function() {
    describe('/alert', function() {
      it('should return 422 when alert data is not in the right structure', async function() {
        const response = await postToApp(app, '/enrichments/alert', invalidStructureAlertReceived);
        expect(response.status).to.be.eq(422);
      });
      it('should be able to handle list of alerts', async function() {
        const response = await postToApp(app, '/enrichments/alert', [alertReceived, alertReceived]);
        expect(response.status).to.be.eq(200);
      });
      it('should fail if one of the messages in the list is not valid', async function() {
        const response = await postToApp(app, '/enrichments/alert', [hermeticityReceived, alertReceived]);
        expect(response.status).to.be.eq(422);
      });
    });
    describe('/hermeticity', function() {
      it('should return 422 when hermeticity data is not in the right structure', async function() {
        const response = await postToApp(app, '/enrichments/hermeticity', invalidStructureHermeticityReceived);
        expect(response.status).to.be.eq(422);
      });
      it('should be able to handle list of hermeticities', async function() {
        const response = await postToApp(app, '/enrichments/hermeticity', [hermeticityReceived, hermeticityReceived]);
        expect(response.status).to.be.eq(200);
      });
      it('should fail if one of the messages in the list is not valid', async function() {
        const response = await postToApp(app, '/enrichments/hermeticity', [hermeticityReceived, alertReceived]);
        expect(response.status).to.be.eq(422);
      });
    });
    it('should return 200 when enrichment type is valid, `hermeticity` or `alert` and data is valid', async function() {
      let response = await postToApp(app, '/enrichments/alert', alertReceived);
      expect(response.status).to.be.eq(200);
      response = await postToApp(app, '/enrichments/hermeticity', hermeticityReceived);
      expect(response.status).to.be.eq(200);
    });
    it('should return 404 when enrichment type is invalid', async function() {
      const response = await postToApp(app, '/enrichments/invalidType', alertReceived);
      expect(response.status).to.be.eq(404);
    });
  });
  describe('kafka', function() {
    describe('sendUntilSuccess function', function() {
      it('should retry sending if `DispatchError` occurs', async function() {
        (dispatcher as any).send
          .onFirstCall()
          .throws(new DispatchError('test error', 500))
          .onSecondCall()
          .throws(new DispatchError('test error', 500));
        await onMessage(hermeticityReceived);
        expect((dispatcher as any).send.calledThrice).to.be.true;
      });
      it('should propagate error if its not `DispatchError`', async function() {
        (dispatcher as any).send
          .onFirstCall()
          .throws(new DispatchError('test error', 500))
          .onSecondCall()
          .throws(new AppError('not dispatch', 500));
        try {
          await onMessage(hermeticityReceived);
        } catch (e) {
          expect(e instanceof AppError).to.be.true;
          return;
        }
        throw new Error('Not error thrown');
      });
    });
  });
});
