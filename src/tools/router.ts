import {Router} from 'express';
import {securityController} from "../security/security.controller";
import {contractorController} from "../contractor/contractor.controller";
import {initiatorController} from "../initiator/initiator.controller";
import {tableMainController} from "../tableMain/table-main.controller";
import {tableAllController} from "../tableAll/table-all.controller";

// /api
export const router = Router();

router.use('/security', securityController);
router.use('/contractor', contractorController);
router.use('/initiator', initiatorController);
router.use('/table/main', tableMainController);
router.use('/table/all', tableAllController);
