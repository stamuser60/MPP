/**
 * Defines the API for the service
 */

import { Router } from 'express';
import { validateEnrichment, validateEnrichmentType } from './validation';
import { EnrichmentType, sendEnrichment } from '../app/app';
import logger from '../logger';
import { EnrichmentReceived } from '../app/dto';
import { enrichmentDispatcher } from '../compositionRoot';

const router = Router();

//TODO: rewrite the documentation of swagger to fit the work the function is doing
/**
 * More docs
 *
 * @swagger
 * /api/v1/enrichments/{type}:
 *  post:
 *   tags:
 *    - Enrichment
 *   description: The gate to henry trough which you send enrichment docs
 *   parameters:
 *    - name: username
 *      description: Some string
 *      type: string
 *      in: path
 *      required: false
 *   produces:
 *    - application/json
 *   responses:
 *    200:
 *      description: OK
 *    400:
 *      description: Data passed is invalid
 */
router.post('/enrichments/:type', async (req, res) => {
  try {
    const { type } = req.params;
    validateEnrichmentType(type);
    validateEnrichment(type as EnrichmentType, req.body);
    await sendEnrichment(type as EnrichmentType, req.body as EnrichmentReceived, enrichmentDispatcher);
    res.sendStatus(200);
  } catch (e) {
    res.status(400).send(e.toString());
    logger.error(`${e.message} \n ${e.stack}`);
  }
});

export default router;
