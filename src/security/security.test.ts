import express from "express";
import {router} from "../tools/router";
import request from "supertest";

const app = express();
app.use(express.json());
app.use('/api', router);

describe('security', () => {
    const url: string = '/api/security';
    const random: number = Math.floor(Math.random() * 100 * 100 * 100 * 100);
    const user = {username: 'root', password: 'root'};

    beforeEach(() => {
    });

    beforeAll(async () => {
    }, 20000);

    describe('getTokenByCredentials', () => {
        test('Should have a username', async () => {
            const response = await request(app)
                .post(url)
                .send({
                    password: user.password,
                })
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.error)
                .toBe('Username is undefined');
        });
        test('Should have a password', async () => {
            const response = await request(app)
                .post(url)
                .send({
                    username: user.username,
                })
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.error)
                .toBe('Password is undefined');
        });
        test('User should be exists', async () => {
            const response = await request(app)
                .post(url)
                .send({
                    username: `${user.username}_${random}`,
                    password: user.password,
                })
                .expect('Content-Type', /json/)
                .expect(403);
            expect(response.body.error)
                .toBe('User not found');
        });
        test('Passwords should be match', async () => {
            const response = await request(app)
                .post(url)
                .send({
                    username: user.username,
                    password: `${user.password}_${random}`,
                })
                .expect('Content-Type', /json/)
                .expect(403);
            expect(response.body.error)
                .toBe('Passwords do not match');
        });
        test('Success', async () => {
            const response = await request(app)
                .post(url)
                .send({
                    username: user.username,
                    password: user.password,
                })
                .expect('Content-Type', /json/)
                .expect(200);
            expect(response.body.token)
                .toBeDefined();
            expect(response.body.user)
                .toBeDefined();
        });
    });

    describe('getUserByToken', () => {
        let token: string = '';
        beforeAll(async () => {
            const response = await request(app)
                .post(url)
                .send({
                    username: user.username,
                    password: user.password,
                })
            token = `Bearer ${response.body.token}`;
        }, 20000);
        test('Should have a header with token', async () => {
            const response = await request(app)
                .get(url)
                .expect('Content-Type', /json/)
                .expect(403);
            expect(response.body.error)
                .toBe('Raw token is undefined');
        });
        test('Should have a correct token', async () => {
            const response = await request(app)
                .get(url)
                .set({'Authorization': token})
                .expect('Content-Type', /json/)
                .expect(200);
            expect(response.body.user.username).toBe(user.username);
        });
    });

});
