import connection from '../database/database.js';
import { isSignUpDataValid } from '../validation/signUp.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

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

async function signInUser (req, res) {
    const { email, password } = req.body;

    try {
        const result = await connection.query(`SELECT * FROM users WHERE email = $1 LIMIT 1;`, [email.trim()]);
        const user = result.rows[0];

        if (result.rowCount === 0) return res.sendStatus(404);
        if (!bcrypt.compareSync(password, user.password)) return res.sendStatus(401);

        const session = await connection.query(`SELECT * FROM sessions WHERE "userId" = $1 LIMIT 1;`, [user.id]);

        if (session.rowCount !== 0) return res.status(200).send({ token: session.rows[0].token });

        const token = uuid();
        await connection.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2);`, [user.id, token]);
        res.status(200).send({token});
    } catch {
        res.sendStatus(500);
    }
}

export {
    signUpNewUser,
    signInUser,
}