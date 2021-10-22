import express from 'express';
import { signUpNewUser, signInUser } from './controllers/users.js';
import { createNewTransaction, listUserTransactions } from './controllers/transactions.js';

const app = express();
app.use(express.json());

app.post('/sign-up', signUpNewUser);

app.post('/sign-in', signInUser);

app.post('/transactions', createNewTransaction);

app.get('/transactions', listUserTransactions);

app.listen(4000);