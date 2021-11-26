import express from 'express';
import cors from 'cors';
import { signUpNewUser, signInUser } from './controllers/users.js';
import { createNewTransaction, listUserTransactions } from './controllers/transactions.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/sign-up', signUpNewUser);

app.post('/sign-in', signInUser);

app.post('/transactions', createNewTransaction);

app.get('/transactions', listUserTransactions);

app.get('/health', (req, res) => res.status(200).send('Server is healty'));

export default app;
