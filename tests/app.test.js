import '../src/setup.js';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import faker from 'faker';
import connection from '../src/database/database.js';
import app from '../src/app.js';
import createUser from './factories/userFactory.js';

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

afterAll(() => {
    connection.end();
});
