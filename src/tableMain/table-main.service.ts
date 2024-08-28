import {Request, Response} from 'express';
import {logger} from "../tools/logger";
import {prisma} from "../tools/prisma";

export interface TableMainFilter {
    dateInput: { from: Date; to: Date };
    dateCopy: { from: Date; to: Date; null: boolean };
    dateOrig: { from: Date; to: Date; null: boolean };

    sum: { from: number; to: number },
    sumClosing: { from: number; to: number },

    contractorIds: number[],
    initiatorIds: number[],

    ddAbout: number[],
    ddMark: number[],
    ddStatus: number[],

    textDestination: string,
    title: string,
}

export interface TableMain {
    id: number,
    dateInput: Date,
    dateCopy: Date,
    dateOrig: Date,

    sum: number,
    sumClosing: number,

    contractorId: number,
    initiatorId: number,

    ddAbout: number,
    ddMark: number,
    ddStatus: number,

    textDestination: string,
    title: string,
}

export class TableMainService {
    constructor() {
        logger.debug('TableMainService');
    }

    async getAll(req: Request, res: Response): Promise<Response> {
        logger.debug('TableMainService.getAll');

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

        const filter: TableMainFilter = JSON.parse(decodedFilter);
        if (!filter) {
            logger.error('Parsing filter issue');
            return res.status(400).json({error: 'Parsing filter issue'})
        }


        const rows = await prisma.tableMain.findMany({
            where: {
                deleted: 0,
                dateInput: {
                    gte: filter.dateInput.from,
                    lte: filter.dateInput.to,
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
                    gte: filter.sumClosing.from,
                    lte: filter.sumClosing.to,
                },
                contractorId: {
                    in: filter.contractorIds,
                },
                initiatorId: {
                    in: filter.initiatorIds,
                },
                ddAbout: {
                    in: filter.ddAbout,
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

    async edit(req: Request, res: Response): Promise<Response> {
        logger.debug('TableMainService.edit');

        const admin = req.body.user.admin;

        const rows = req.body.rows as TableMain[];
        if (!rows || rows.length === 0) {
            return res.status(400).json({error: 'No rows found'})
        }

        for (const row of rows) {
            try {
                await prisma.tableMain.update({
                    where: {
                        id: row.id,
                    },
                    data: {
                        sumClosing: row.sumClosing,
                        ddAbout: row.ddAbout,
                        ddStatus: row.ddStatus,
                        title: row.title,
                        ...(admin && {
                            dateOrig: row.dateOrig,
                            dateCopy: row.dateCopy,
                            ddMark: row.ddMark,
                        }),
                    }
                })
            } catch (error) {
                console.error(error);
                return res.status(500).json({error: 'Error while updating table'})
            }
        }

        return res.status(200).json({message: 'Rows updated successfully'});
    }

}
