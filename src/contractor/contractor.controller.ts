import {Router} from "express";
import {ContractorService} from "./contractor.service";

const service = new ContractorService();

// /api/contractor
export const contractorController = Router();

contractorController.get('/', service.getAll);
contractorController.post('/', service.create);
