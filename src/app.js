import express from 'express';
import { signUpNewUser } from './controllers/users.js';

const app = express();
app.use(express.json());

app.post('/sign-up', signUpNewUser);

app.listen(4000);