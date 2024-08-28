import {Router} from 'express';
import {securityController} from "../security/security.controller";

// /api
export const router = Router();

router.use('/security', securityController);
// router.use('/table', tableController);
// router.use('/log', logController);
