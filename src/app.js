import express from 'express';
import { signUpNewUser, signInUser } from './controllers/users.js';

const app = express();
app.use(express.json());

app.post('/sign-up', signUpNewUser);

app.post('/sign-in', signInUser);

app.listen(4000);