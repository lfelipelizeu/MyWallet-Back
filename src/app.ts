import './setup';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import connectDatabase from './database';
import * as transactionController from './controllers/transactionController';
import * as userController from './controllers/userController';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/sign-up', userController.signUp);

app.post('/sign-in', userController.signIn);

app.post('/transactions', transactionController.createNewTransaction);

app.get('/transactions', transactionController.listUserTransactions);

app.get('/health', (req, res) => res.status(200).send('Server is healty'));

export async function init() {
    await connectDatabase();
}

export default app;
