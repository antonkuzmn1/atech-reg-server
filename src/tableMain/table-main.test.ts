import express from "express";
import {router} from "../tools/router";
import request from "supertest";

const filter = {
    dateInput: {
        from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    },
    dateCopy: {
        from: new Date(2000, 0, 1),
        to: new Date(2100, 0, 1),
        null: true,
    },
    dateOrig: {
        from: new Date(2000, 0, 1),
        to: new Date(2100, 0, 1),
        null: true,
    },
    sum: {
        from: 0,
        to: 99999999999,
    },
    sumClosing: {
        from: 0,
        to: 99999999999,
    },
    contractorIds: [],
    initiatorIds: [],
    ddAbout: [],
    ddMark: [],
    ddStatus: [],
    textDestination: '',
    title: '',
};

const encodedFilter = encodeURIComponent(JSON.stringify(filter));

const app = express();
app.use(express.json());
app.use('/api', router);

describe('tableMain', () => {
    const url: string = '/api/table/main';
    const random: number = Math.floor(Math.random() * 100 * 100 * 100 * 100);

    describe('getAll', () => {
        test('Success?', async () => {
            const response = await request(app)
                .get(url)
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.error)
                .toBe('No filter found');
        });
        test('Success', async () => {
            const response = await request(app)
                .get(url + '/?filter=' + encodedFilter)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(response.body.rows)
                .toBeDefined();
        });
    });

    // describe('create', () => {
    //     test('Should have a name', async () => {
    //         const response = await request(app)
    //             .post(url)
    //             .expect('Content-Type', /json/)
    //             .expect(400);
    //         expect(response.body.error)
    //             .toBe('Name is required');
    //     });
    //     test('Should create', async () => {
    //         const response = await request(app)
    //             .post(url)
    //             .send({
    //                 name: random,
    //             })
    //             .expect('Content-Type', /json/)
    //             .expect(200);
    //         expect(response.body.response.name)
    //             .toBe(random.toString());
    //     });
    //     test('Should not create a duplicate', async () => {
    //         const response = await request(app)
    //             .post(url)
    //             .send({
    //                 name: random,
    //             })
    //             .expect('Content-Type', /json/)
    //             .expect(500);
    //         expect(response.body.error)
    //             .toBeDefined();
    //     });
    // });

});
