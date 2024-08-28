import {Request, Response} from 'express';
import {logger} from "../tools/logger";
import {prisma} from "../tools/prisma";
import jwt from "jsonwebtoken";
import {User} from "@prisma/client";

export interface JwtPayload {
    id: number;
}

const JWT_SECRET = process.env.JWT_SECRET

export class SecurityService {
    constructor() {
        logger.debug('SecurityService');
    }

    async getTokenByCredentials(req: Request, res: Response): Promise<Response> {
        logger.debug('SecurityService.getTokenByCredentials');

        if (!JWT_SECRET) {
            logger.error('JWT_SECRET is undefined');
            return res.status(500).json({error: 'Internal Server Error'});
        }

        const username = req.body.username;
        if (!username) {
            logger.error('Username is undefined');
            return res.status(400).json({error: 'Username is undefined'});
        }

        const password = req.body.password;
        if (!password) {
            logger.error('Password is undefined');
            return res.status(400).json({error: 'Password is undefined'});
        }

        const user: User | null = await prisma.user.findUnique({
            where: {username, deleted: 0}
        });
        if (!user) {
            logger.error('User not found');
            return res.status(403).json({error: 'User not found'});
        }

        const passwordIsValid = password === user.password;
        if (!passwordIsValid) {
            logger.error('Passwords do not match');
            return res.status(403).json({error: 'Passwords do not match'});
        }

        const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '12h'});

        logger.info(`Token received: ${token}`);
        return res.status(200).json({token: token, user: user});
    }

    async getUserByToken(req: Request, res: Response): Promise<Response> {
        logger.debug('SecurityService.getUserByToken');

        if (!JWT_SECRET) {
            logger.error('JWT_SECRET is undefined');
            return res.status(500).json({error: 'Internal Server Error'});
        }

        const tokenRaw: string | undefined = req.headers.authorization;
        if (!tokenRaw) {
            logger.error('Raw token is undefined');
            return res.status(403).json({error: 'Raw token is undefined'});
        }

        const token: string | null = tokenRaw && tokenRaw.startsWith('Bearer ') ? tokenRaw.substring(7) : null;
        if (!token) {
            logger.error('Token is undefined');
            return res.status(403).json({error: 'Token is undefined'});
        }

        try {
            const decodedToken: JwtPayload = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
            if (!decodedToken.id) {
                logger.error('Decoded token is undefined');
                return res.status(403).json({error: 'Decoded token is undefined'});
            }

            const user: User | null = await prisma.user.findUnique({
                where: {id: decodedToken.id, deleted: 0},
            });
            if (!user) {
                logger.error('User not found');
                return res.status(403).json({error: 'User not found'});
            }

            logger.info(`Received user from the token: ${user.username}`);
            return res.status(200).json({user: user});
        } catch (error) {
            console.error(error);
            logger.error('Try-Catch is not passed');
            return res.status(500).json({error: 'Try-Catch is not passed'});
        }
    }

}
