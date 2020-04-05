/**
 * Responsible for managing the swagger middleware.
 */

import swaggerJSDoc from 'swagger-jsdoc';
import SwaggerUI from 'swagger-ui-express';
import { Router } from 'express';

const swaggerRouter = Router();

const swaggerDefinition = {
  info: {
    title: 'MPP',
    version: '1.0.0',
    description: 'Gateway of enrichment data into CPR'
  },
  basepath: '/'
};

const options = {
  swaggerDefinition: swaggerDefinition,
  apis: [__dirname + '/api/*.ts', __dirname + '/../api/*.ts']
};
const swaggerSpec = swaggerJSDoc(options);

swaggerRouter.get('/swagger.json', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.set('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

swaggerRouter.use('/', SwaggerUI.serve, SwaggerUI.setup(swaggerSpec));

export default swaggerRouter;
