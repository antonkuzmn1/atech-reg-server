import {Router} from "express";
import {TableMainService} from "./table-main.service";
import {SecurityMiddleware} from "../security/security.middleware";

const service = new TableMainService();
const middleware = new SecurityMiddleware();

// /api/table/main
export const tableMainController = Router();

tableMainController.get('/', service.getAll);
tableMainController.put('/', middleware.getUserFromToken, service.edit)

