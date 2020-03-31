import { Router } from 'express';
import { Schema, Validator } from 'jsonschema';
import { TypeToValidation, validateEnrichmentType } from './typeFactory';
import { EnrichmentType, sendEnrichment } from '../app/app';
import { MsgDispatcher } from '../core/msgDispatcher';
import logger from '../logger';
import { EnrichmentDTO } from '../app/dto';

const router = Router();

/**
 * More docs
 *
 * @swagger
 * /api/v1/enrichments/{type}:
 *  get:
 *   tags:
 *    - System
 *   description: Example of defining swagger docs
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
 *    401:
 *      description: Unauthorized
 */
router.post('/enrichments/:type', async (req, res) => {
  try {
    const { type } = req.params;
    validateEnrichmentType(type);
    const newNodeValidator = new Validator();
    const jsonSchemaOptions = { throwError: true };
    const schema = TypeToValidation[type as EnrichmentType];
    newNodeValidator.validate(req.body, schema as Schema, jsonSchemaOptions);
    await sendEnrichment(type as EnrichmentType, req.body as EnrichmentDTO, {} as MsgDispatcher);
    res.sendStatus(200);
  } catch (e) {
    res.status(400).send(e.toString());
    logger.error(e.stack);
  }
});

export default router;
