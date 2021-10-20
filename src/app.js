import express from 'express';
import connection from './database/database.js';
import { validateSignin } from './validation/signUp.js';

const app = express();
app.use(express.json());

app.post('/sign-up', async (req, res) => {
    const { name, email, password, repeatPassword } = req.body;

    const validation = validateSignin.validate({
        name,
        email,
        password,
        repeatPassword,
    });

    res.send(validation);
});

app.listen(4000);