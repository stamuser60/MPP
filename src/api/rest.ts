/**
 * Defines the API for the service
 */

import { Router } from 'express';
import { validateEnrichmentsReceived, validateEnrichmentType } from './validation';
import { sendEnrichment } from '../app/app';
import logger from '../logger';
import { enrichmentDispatcher } from '../compositionRoot';
import { AppError } from '../core/exc';

const router = Router();

/**
 * @swagger
 *  components:
 *    schemas:
 *      Alert:
 *        type: object
 *        required:
 *          - timestamp
 *          - severity
 *          - operator
 *          - node
 *          - object
 *          - description
 *          - application
 *          - origin
 *        properties:
 *          origin:
 *            type: string
 *            description: name of the source from where the enrichment is sent
 *          severity:
 *            type: string
 *            enum: [normal, warning, minor, major, critical]
 *          timestamp:
 *            type: string
 *            format: date-time
 *            description: string representing the timestamp the enrichment document was created
 *          node:
 *            type: string
 *            description: relevant node to the alert
 *          description:
 *            type: string
 *            description: the description of the alert
 *          object:
 *            type: string
 *            description: relevant object to the alert
 *          application:
 *            type: string
 *            description: relevant application to the alert
 *          operator:
 *            type: string
 *            description: relevant operator to the alert
 *      Hermeticity:
 *        type: object
 *        required:
 *          - timestamp
 *          - severity
 *          - origin
 *          - status
 *          - value
 *          - beakID
 *          - hasAlert
 *        properties:
 *          origin:
 *            type: string
 *            description: name of the source from where the enrichment is sent
 *          timestamp:
 *            type: string
 *            format: date-time
 *            description: timestamp the enrichment document was created
 *          status:
 *            type: integer
 *            enum: [1, 2 ,3]
 *            description: the status of the hermeticity, 1 - normal, 2 - minor, 3 - critical
 *          value:
 *            type: integer
 *            minimum: 0
 *            maximum: 100
 *            description: the value of the hermeticity, in percentage
 *          beakID:
 *            type: string
 *            description: a unique beak id which the hermeticity is related to
 *          hasAlert:
 *            type: boolean
 *            description: if true, then there is an alert on that beak, else there is none
 */

/**
 * @swagger
 * path:
 *  /api/v1/enrichments/{type}:
 *    post:
 *      summary: Send enrichment doc to CPR
 *      tags: [Enrichment]
 *      parameters:
 *        - in: path
 *          name: type
 *          schema:
 *            type: string
 *            enum: [alert, hermeticity]
 *          required: true
 *          description: name of the enrichment type
 *      requestBody:
 *        description: Content of the enrichment, DATA HAS TO MATCH THE CORRESPONDING ENRICHMENT TYPE
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/Alert'
 *                - $ref: '#/components/schemas/Hermeticity'
 *                - type: array
 *                  items:
 *                    $ref: '#/components/schemas/Alert'
 *                - type: array
 *                  items:
 *                    $ref: '#/components/schemas/Hermeticity'
 *            examples:
 *              alert:
 *                summary: An example of alert doc
 *                value:
 *                  origin: test
 *                  timestamp: 2020-04-14T13:26:09.420Z
 *                  node: someNodeName
 *                  severity: critical
 *                  description: some description
 *                  object: objectName
 *                  application: applicationName
 *                  operator: operatorName
 *              hermeticity:
 *                summary: An example of hermeticity doc
 *                value:
 *                  origin: anotherTest
 *                  timestamp: 2020-04-14T13:26:09.420Z
 *                  status: 2
 *                  value: 95
 *                  beakID: someRandomId12321dwef
 *                  hasAlert: false
 *
 *      responses:
 *        200:
 *          description: send enrichment successfully
 *        422:
 *          description: incorrect data was sent
 *        503:
 *          description: could not send the message to kafka
 */
router.post('/enrichments/:type', async (req, res) => {
  try {
    const typeStr = req.params.type;
    const type = validateEnrichmentType(typeStr);
    const enrichmentsReceived = validateEnrichmentsReceived(type, req.body);
    await sendEnrichment(type, enrichmentsReceived, enrichmentDispatcher);
    res.sendStatus(200);
  } catch (e) {
    if (e instanceof AppError) {
      res.status(e.status).send(e.toString());
    } else {
      res.status(400).send(e.toString());
    }
    logger.error(`${e.message} \n ${e.stack}`);
  }
});

export default router;
