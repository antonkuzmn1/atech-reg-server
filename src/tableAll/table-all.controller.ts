import {Router} from "express";
import {SecurityMiddleware} from "../security/security.middleware";
import {TableAllService} from "./table-all.service";

const service = new TableAllService();
const middleware = new SecurityMiddleware();

// /api/table/all
export const tableAllController = Router();

tableAllController.get('/', service.getAll);
tableAllController.post('/', service.create)
tableAllController.put('/', middleware.getUserFromToken, service.edit)
