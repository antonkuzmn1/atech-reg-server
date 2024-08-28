import {Router} from "express";
import {SecurityService} from "./security.service";

const service = new SecurityService();

// /api/security
export const securityController = Router();

securityController.post('/', service.getTokenByCredentials);
securityController.get('/', service.getUserByToken);
