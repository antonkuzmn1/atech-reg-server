import {NextFunction, Request, Response} from 'express';
import {logger} from "../tools/logger";
import {prisma} from "../tools/prisma";
import jwt from "jsonwebtoken";
import {User} from "@prisma/client";

export class ContractorService {
    constructor() {
        logger.debug('ContractorService');
    }

    async getAll(req: Request, res: Response): Promise<Response> {
        logger.debug('ContractorService.getAll');

        const contractors = await prisma.contractor.findMany({
            where: {
                deleted: 0,
            },
        });

        return res.status(200).json({contractors: contractors});
    }

    async create(req: Request, res: Response): Promise<Response> {
        logger.debug('ContractorService.create');

        const name = req.body.name;
        if (!name) {
            logger.error('Name is required');
            return res.status(400).json({error: 'Name is required'});
        }

        try {
            const response = await prisma.contractor.create({
                data: {
                    name: name.toString(),
                },
            })
            return res.status(200).json({response: response});
        } catch (error) {
            console.error(error);
            logger.error('Could not create contractor service');
            return res.status(500).json({error: error});
        }
    }

}
