import {Request, Response} from 'express';
import {logger} from "../tools/logger";
import {prisma} from "../tools/prisma";

export interface TableAllFilter {
    dateDocument: { from: Date; to: Date };
    dateCopy: { from: Date; to: Date; null: boolean };
    dateOrig: { from: Date; to: Date; null: boolean };

    sum: { from: number; to: number },
    number: { from: number; to: number },

    contractorIds: number[],
    initiatorIds: number[],

    ddMark: number[],
    ddStatus: number[],

    textDestination: string,
    title: string,
}

export interface TableAll {
    id: number,
    dateDocument: Date,
    dateCopy: Date,
    dateOrig: Date,

    sum: number,
    number: number,

    contractorId:  number,
    initiatorId: number,

    ddMark: number,
    ddStatus: number,

    textDestination: string,
    title: string,
}

export class TableAllService {
    constructor() {
        logger.debug('TableAllService');
    }

    async getAll(req: Request, res: Response): Promise<Response> {
        logger.debug('TableAllService.getAll');

        const rawFilter = req.query.filter as string;
        if (!rawFilter) {
            logger.error('No filter found');
            return res.status(400).json({error: 'No filter found'})
        }

        const decodedFilter = decodeURIComponent(rawFilter);
        if (!decodedFilter) {
            logger.error('Decoding filter issue');
            return res.status(400).json({error: 'Decoding filter issue'})
        }

        const filter: TableAllFilter = JSON.parse(decodedFilter);
        if (!filter) {
            logger.error('Parsing filter issue');
            return res.status(400).json({error: 'Parsing filter issue'})
        }


        const rows = await prisma.tableMain.findMany({
            where: {
                deleted: 0,
                dateInput: {
                    gte: filter.dateDocument.from,
                    lte: filter.dateDocument.to,
                },
                dateCopy: {
                    gte: filter.dateCopy.from,
                    lte: filter.dateCopy.to,
                    ...(filter.dateCopy.null ? {equals: null} : {}),
                },
                dateOrig: {
                    gte: filter.dateOrig.from,
                    lte: filter.dateOrig.to,
                    ...(filter.dateOrig.null ? {equals: null} : {}),
                },
                sum: {
                    gte: filter.sum.from,
                    lte: filter.sum.to,
                },
                sumClosing: {
                    gte: filter.number.from,
                    lte: filter.number.to,
                },
                contractorId: {
                    in: filter.contractorIds,
                },
                initiatorId: {
                    in: filter.initiatorIds,
                },
                ddMark: {
                    in: filter.ddMark,
                },
                ddStatus: {
                    in: filter.ddStatus,
                },
                textDestination: {
                    contains: filter.textDestination,
                },
                title: {
                    contains: filter.title,
                },
            },
        });

        return res.status(200).json({rows: rows});
    }

    async create(req: Request, res: Response): Promise<Response> {
        logger.debug('TableAllService.create');

        const row = req.body.row as TableAll;
        if (!row) {
            return res.status(400).json({error: 'No row found'})
        }

        try {
            await prisma.tableAll.create({
                data: {
                    dateDocument: row.dateDocument,
                    dateCopy: row.dateCopy,
                    dateOrig: row.dateOrig,
                    sum: row.sum,
                    number: row.number,
                    contractorId: row.contractorId,
                    initiatorId: row.initiatorId,
                    ddMark: row.ddMark,
                    ddStatus: row.ddStatus,
                    textDestination: row.textDestination,
                    title: row.title,
                }
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({error: 'Error while inserting row'})
        }

        return res.status(200).json({ message: 'Row inserted successfully' });
    }

    async edit(req: Request, res: Response): Promise<Response> {
        logger.debug('TableAllService.edit');

        const admin = req.body.user.admin;

        const rows = req.body.rows as TableAll[];
        if (!rows || rows.length === 0) {
            return res.status(400).json({error: 'No rows found'})
        }

        for(const row of rows) {
            try {
                await prisma.tableAll.update({
                    where: {
                        id: row.id,
                    },
                    data: {
                        title: row.title,
                        ...(admin && {
                            initiatorId: row.initiatorId,
                            ddMark: row.ddMark,
                        }),
                    }
                })
            } catch (error) {
                console.error(error);
                return res.status(500).json({error: 'Error while updating table'})
            }
        }

        return res.status(200).json({ message: 'Rows updated successfully' });
    }

}
