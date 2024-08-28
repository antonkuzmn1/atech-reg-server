import {Router} from 'express';
import {securityController} from "../security/security.controller";
import {contractorController} from "../contractor/contractor.controller";

// /api
export const router = Router();

router.use('/security', securityController);
router.use('/contractor', contractorController)
