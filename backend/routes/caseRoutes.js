import express from 'express';
import { createCase, getCases, updateCaseStatus, addCaseMessage } from '../controllers/caseController.js';

const router = express.Router();

router.route('/')
    .post(createCase)
    .get(getCases);

router.route('/:id/status')
    .patch(updateCaseStatus);

router.route('/:id/messages')
    .post(addCaseMessage);

export default router;
