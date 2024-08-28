import {prisma} from "./prisma";
import {logger} from "./logger";

export class OnStartupActions {
    constructor() {
        logger.debug("OnStartupActions");
    }

    async runAll() {
        logger.debug("OnStartupActions.runAll");
        await this.createRootIfNotExists();
    }

    async createRootIfNotExists(): Promise<boolean> {
        logger.debug("OnStartupActions.createRootIfNotExists");

        const user = await prisma.user.findUnique({
            where: {id: 1, username: 'root'}
        });
        if (!user) {
            const data = {username: 'root', password: 'root'}
            await prisma.user.create({data});
            logger.info('Root has been created');
            return true;
        } else {
            logger.info('Root already exists');
            return false;
        }
    };
}
