import express from 'express';
import cors from 'cors';
import { createNewTransaction, listUserTransactions } from './controllers/transactions.js';
import * as userController from './controllers/userController.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/sign-up', userController.signUp);

app.post('/sign-in', userController.signIn);

app.post('/transactions', createNewTransaction);

app.get('/transactions', listUserTransactions);

app.get('/health', (req, res) => res.status(200).send('Server is healty'));

export default app;
