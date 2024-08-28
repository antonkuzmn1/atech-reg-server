import {Router} from "express";
import {InitiatorService} from "./initiator.service";

const service = new InitiatorService();

// /api/initiator
export const initiatorController = Router();

initiatorController.get('/', service.getAll);
initiatorController.post('/', service.create);
