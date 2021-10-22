import connection from '../database/database.js';
import { isSignUpDataValid } from '../validation/signUp.js';
import bcrypt from 'bcrypt';

async function signUpNewUser (req, res) {
    if (!isSignUpDataValid(req.body)) return res.sendStatus(400);

    const { name, email } = req.body;
    const password = bcrypt.hashSync(req.body.password, 10);

    try {
        const result = await connection.query(`SELECT * FROM users WHERE email = $1 LIMIT 1;`, [email]);
        if (result.rowCount !== 0 ) return res.sendStatus(409);

        await connection.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`, [name, email, password]);

        res.sendStatus(201);
    } catch {
        res.sendStatus(500);
    }
}

export {
    signUpNewUser,
}