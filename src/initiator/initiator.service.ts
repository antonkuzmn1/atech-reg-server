import {Request, Response} from 'express';
import {logger} from "../tools/logger";
import {prisma} from "../tools/prisma";

export class InitiatorService {
    constructor() {
        logger.debug('InitiatorService');
    }

    async getAll(req: Request, res: Response): Promise<Response> {
        logger.debug('InitiatorService.getAll');

        const initiators = await prisma.initiator.findMany({
            where: {
                deleted: 0,
            },
        });

        return res.status(200).json({initiators: initiators});
    }

    async create(req: Request, res: Response): Promise<Response> {
        logger.debug('InitiatorService.create');

        const name = req.body.name;
        if (!name) {
            logger.error('Name is required');
            return res.status(400).json({error: 'Name is required'});
        }

        try {
            const response = await prisma.initiator.create({
                data: {
                    name: name.toString(),
                },
            })
            return res.status(200).json({response: response});
        } catch (error) {
            console.error(error);
            logger.error('Could not create');
            return res.status(500).json({error: error});
        }
    }

}
