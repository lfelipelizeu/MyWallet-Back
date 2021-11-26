import '../src/setup.js';
import supertest from 'supertest';
import connection from '../src/database/database.js';
import app from '../src/app.js';

describe('POST /signup', () => {
    afterEach(async () => {
        await connection.query('DELETE FROM users WHERE name = \'Conta de teste\';');
    });

    it('returns 400 for invalid body', async () => {
        const body = {
            name: 'Conta de teste',
            password: '12345',
            repeatPassword: '12345',
        };

        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(400);
    });

    it('returns 400 for invalid email', async () => {
        const body = {
            name: 'Conta de teste',
            email: 'teste@email',
            password: '12345',
            repeatPassword: '12345',
        };

        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(400);
    });

    it('returns 400 for not matching passwords', async () => {
        const body = {
            name: 'Conta de teste',
            email: 'teste@email',
            password: '12345',
            repeatPassword: '123456789',
        };

        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(400);
    });

    it('returns 409 for email already registered', async () => {
        await connection.query('INSERT INTO users (name, email, password) VALUES (\'Conta de teste\', \'teste@email.com\', \'12345\')');

        const body = {
            name: 'Conta de teste 2',
            email: 'teste@email.com',
            password: '12345',
            repeatPassword: '12345',
        };

        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(409);
    });

    it('returns 201 for valid data', async () => {
        const body = {
            name: 'Conta de teste',
            email: 'teste@email.com',
            password: '12345',
            repeatPassword: '12345',
        };

        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(201);
    });
});

afterAll(() => {
    connection.end();
});
