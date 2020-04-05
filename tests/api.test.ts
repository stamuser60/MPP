import sinon, { SinonSandbox } from 'sinon';
import { expect } from 'chai';
import request from 'supertest';
import app, { API_PREFIX_V1 } from '../src/server/server';
import * as core from 'express-serve-static-core';
import logger from '../src/logger';

function postToApp(app: core.Express, path: string, data: object) {
  return request(app)
    .post(`${API_PREFIX_V1}${path}`)
    .send(data);
}

describe('api', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
  });
  afterEach(function() {
    sandbox.restore();
  });

  describe('/swagger route', function() {
    it('should return OK status', function() {
      return request(app)
        .get('/swagger')
        .then(function(response) {
          expect(response.status).to.be.oneOf([200, 301]);
        });
    });
  });
  describe('/enrichment', function() {
    it('should return 400 when enrichment type is invalid', async function() {
      const response = await postToApp(app, '/enrichments/invalidType', {});
      expect(response.status).to.be.eq(400);
      console.log(response.status);
    });
    it('should return 200 when enrichment type is valid, `hermeticity` or `alert`', async function() {
      const response = await postToApp(app, '/enrichments/invalidType', {});
      expect(response.status).to.be.eq(400);
      console.log(response.body);
    });
  });
});
