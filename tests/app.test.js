import '../src/setup.js';
import supertest from 'supertest';
import connection from '../src/database/database.js';
import app from '../src/app.js';
import createUser from './factories/userFactory.js';
import bcrypt from 'bcrypt';

describe('POST /signup', () => {
    const user = createUser();

    beforeAll(async () => {
        const hashPassword = bcrypt.hashSync(user.password, 10);
        const insertedUser = await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;', [user.name, user.email, hashPassword]);
        user.id = insertedUser.rows[0].id;
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
        const body = {
            name: user.name,
            email: user.email,
            password: user.password,
            repeatPassword: user.repeatPassword,
        };

        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(409);
    });

    it('returns 201 for valid data', async () => {
        const body = createUser();

        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(201);
    });
});

afterAll(() => {
    connection.end();
});
