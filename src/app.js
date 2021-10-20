import express from 'express';
import connection from './database/database.js';

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
    const users = (await connection.query(`SELECT * FROM users;`)).rows;

    res.send(users);
});

app.listen(4000);