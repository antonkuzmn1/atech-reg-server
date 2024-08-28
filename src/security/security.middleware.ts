import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {prisma} from "../tools/prisma";
import {logger} from "../tools/logger";

export class SecurityMiddleware {
    JWTSecret?: string = process.env.JWT_SECRET;

    constructor() {
        logger.debug("SecurityMiddleware");
    }

    getUserFromToken = async (req: Request, res: Response, next: NextFunction) => {
        logger.debug("SecurityMiddleware.getUserFromToken");
        if (!this.JWTSecret) {
            logger.error('JWT_SECRET is undefined');
            return res.status(500).json({error: 'Internal Server Error'});
        }

        const tokenRaw = req.headers.authorization;
        const token = tokenRaw && tokenRaw.startsWith('Bearer ') ? tokenRaw.substring(7) : null;
        if (!token) {
            logger.error('Token is undefined');
            return res.status(403).json({error: 'Token is undefined'});
        }

        try {
            const decodedToken = jwt.verify(token, this.JWTSecret) as any;
            if (!decodedToken || !decodedToken.id || typeof decodedToken.id !== 'number') {
                logger.error('Decoded token is undefined');
                return res.status(403).json({error: 'Decoded token is undefined'});
            }

            const user = await prisma.user.findUnique({
                where: {
                    id: decodedToken.id,
                    deleted: 0
                },
                include: {
                    groups: {
                        include: {
                            group: true
                        }
                    }
                }
            });
            if (!user) {
                logger.error('User does not exist');
                return res.status(403).json({error: 'User does not exist'});
            }

            const userWithGroupIds = {
                ...user,
                groupIds: user.groups.map(userGroup => userGroup.groupId),
            };

            logger.info('User found with userId ' + decodedToken.id);
            req.body.user = userWithGroupIds;
            next();
        } catch (error) {
            console.error(error);
            logger.error('Try-Catch is not passed');
            return res.status(500).json({error: 'Try-Catch is not passed'});
        }
    }

    userShouldBeAdmin = async (req: Request, res: Response, next: NextFunction) => {
        logger.debug("SecurityMiddleware.userShouldBeAdmin");
        const user = req.body.initiator;
        if (!user) {
            logger.error('User is undefined');
            return res.status(403).json({error: 'User is undefined'});
        }

        if (!user.admin) {
            logger.error('User is not admin');
            return res.status(403).json({error: 'User is not admin'});
        }

        logger.info("User is admin");
        next();
    }
}
