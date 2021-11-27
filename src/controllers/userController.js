import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from '../database/database.js';
import * as userService from '../services/userService.js';
import * as userRepository from '../repositories/userRepository.js';

async function signUp(req, res) {
    const validationError = userService.signUpDataValidationError(req.body);
    if (validationError) return res.status(400).send(validationError.message);

    try {
        if (await userRepository.hasEmailConflict(req.body.email)) return res.sendStatus(409);

        await userService.createUser(req.body);

        return res.sendStatus(201);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function signInUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) return res.sendStatus(400);

    try {
        const result = await connection.query('SELECT * FROM users WHERE email = $1 LIMIT 1;', [email.trim()]);
        const user = result.rows[0];

        if (!user) return res.sendStatus(404);
        if (!bcrypt.compareSync(password, user.password)) return res.sendStatus(401);

        const session = await connection.query('SELECT * FROM sessions WHERE user_id = $1 LIMIT 1;', [user.id]);

        if (session.rowCount !== 0) {
            return res.status(200).send({ name: user.name, token: session.rows[0].token });
        }

        const token = uuid();
        await connection.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2);', [user.id, token]);
        return res.status(200).send({
            name: user.name,
            token,
        });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export {
    signUp,
    signInUser,
};
