import '../src/setup.js';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import faker from 'faker';
import { v4 as uuid } from 'uuid';
import connection from '../src/database/database.js';
import app from '../src/app.js';
import createUser from './factories/userFactory.js';
import createTransaction from './factories/transactionFactory.js';

describe('POST /signup', () => {
    const user = createUser();

    beforeAll(async () => {
        const hashPassword = bcrypt.hashSync(user.password, 10);
        await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;', [user.name, user.email, hashPassword]);
    });

    afterAll(async () => {
        await connection.query('DELETE FROM users;');
    });

    it('returns 400 for invalid body', async () => {
        const testUser = createUser();

        const body = {
            name: testUser.name,
            password: testUser.password,
            repeatPassword: testUser.password,
        };

        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(400);
    });

    it('returns 409 for email already registered', async () => {
        const body = user;

        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(409);
    });

    it('returns 201 for valid data', async () => {
        const body = createUser();

        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(201);
    });
});

describe('POST /sign-in', () => {
    const user = createUser();

    beforeAll(async () => {
        const hashPassword = bcrypt.hashSync(user.password, 10);
        await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;', [user.name, user.email, hashPassword]);
    });

    afterAll(async () => {
        await connection.query('DELETE FROM sessions;');
        await connection.query('DELETE FROM users;');
    });

    it('returns 400 for invalid body', async () => {
        const body = {
            email: user.email,
        };

        const result = await supertest(app).post('/sign-in').send(body);
        expect(result.status).toEqual(400);
    });

    it('returns 404 for not registered user', async () => {
        const body = createUser();

        const result = await supertest(app).post('/sign-in').send(body);
        expect(result.status).toEqual(404);
    });

    it('returns 401 for wrong password', async () => {
        const body = {
            email: user.email,
            password: faker.internet.password(),
        };

        const result = await supertest(app).post('/sign-in').send(body);
        expect(result.status).toEqual(401);
    });

    it('returns 200 for wrong password', async () => {
        const body = user;

        const result = await supertest(app).post('/sign-in').send(body);
        expect(result.status).toEqual(200);
    });
});

describe('POST /transactions', () => {
    const user = createUser();
    let session;

    beforeAll(async () => {
        const hashPassword = bcrypt.hashSync(user.password, 10);
        const insertedUser = await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;', [user.name, user.email, hashPassword]);
        user.id = insertedUser.rows[0].id;

        const newSession = await connection.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2) RETURNING *;', [user.id, uuid()]);
        // eslint-disable-next-line prefer-destructuring
        session = newSession.rows[0];
    });

    afterAll(async () => {
        await connection.query('DELETE FROM transactions;');
        await connection.query('DELETE FROM sessions;');
        await connection.query('DELETE FROM users;');
    });

    it('returns 401 for no token received', async () => {
        const body = createTransaction();

        const result = await supertest(app).post('/transactions').send(body);
        expect(result.status).toEqual(401);
    });

    it('returns 422 for invalid body', async () => {
        const newTransaction = createTransaction();

        const body = {
            description: newTransaction.description,
            type: newTransaction.type,
            date: newTransaction.date,
        };

        const result = await supertest(app).post('/transactions').send(body).set('authorization', session.token);
        expect(result.status).toEqual(422);
    });

    it('returns 401 for invalid session', async () => {
        const body = createTransaction();

        const result = await supertest(app).post('/transactions').send(body).set('authorization', faker.datatype.uuid());
        expect(result.status).toEqual(401);
    });

    it('returns 201 for valid data', async () => {
        const body = createTransaction();

        const result = await supertest(app).post('/transactions').send(body).set('authorization', session.token);
        expect(result.status).toEqual(201);
    });
});

afterAll(() => {
    connection.end();
});
