import express from "express";
import {router} from "../tools/router";
import request from "supertest";

const app = express();
app.use(express.json());
app.use('/api', router);

describe('initiator', () => {
    const url: string = '/api/initiator';
    const random: number = Math.floor(Math.random() * 100 * 100 * 100 * 100);

    describe('getAll', () => {
        test('Success', async () => {
            const response = await request(app)
                .get(url)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(response.body.initiators)
                .toBeDefined();
        });
    });

    describe('create', () => {
        test('Should have a name', async () => {
            const response = await request(app)
                .post(url)
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.error)
                .toBe('Name is required');
        });
        test('Should create', async () => {
            const response = await request(app)
                .post(url)
                .send({
                    name: random,
                })
                .expect('Content-Type', /json/)
                .expect(200);
            expect(response.body.response.name)
                .toBe(random.toString());
        });
        test('Should not create a duplicate', async () => {
            const response = await request(app)
                .post(url)
                .send({
                    name: random,
                })
                .expect('Content-Type', /json/)
                .expect(500);
            expect(response.body.error)
                .toBeDefined();
        });
    });

});
