import express from 'express';
const router = express.Router();
import { body } from 'express-validator';
import {
    requireAuth,
    requireBotAuth,
    requireWorkspaceAuth,
    validateRequest
} from '../middleware';
import { botController } from '../controllers';
import { ADMIN, MEMBER, COMPLETED, GRANTED } from '../variables';

router.get(
    '/',
	requireAuth,
	requireWorkspaceAuth({
		acceptedRoles: [ADMIN, MEMBER],
		acceptedStatuses: [COMPLETED, GRANTED],
        location: 'body'
	}),
    body('workspaceId').exists().trim().notEmpty(),
    validateRequest,
    botController.getBotByWorkspaceId
);

router.patch(
    '/:botId/active',
    requireAuth,
    requireBotAuth({
		acceptedRoles: [ADMIN, MEMBER],
		acceptedStatuses: [COMPLETED, GRANTED]
    }),
    body('isActive').isBoolean(),
    body('botKey'),
    validateRequest,
    botController.setBotActiveState
);

export default router;