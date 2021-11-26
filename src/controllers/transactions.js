import dayjs from 'dayjs';
import connection from '../database/database.js';
import isTransactionDataValid from '../validation/newTransaction.js';

async function createNewTransaction(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const { description, value, type } = req.body;

    if (!token) return res.sendStatus(401);
    if (!isTransactionDataValid(req.body) || !(type === 'income' || type === 'outcome')) return res.sendStatus(422);

    try {
        const result = await connection.query('SELECT *, user_id as "userId" FROM sessions WHERE token = $1 LIMIT 1;', [token]);
        const session = result.rows[0];

        if (!session) return res.sendStatus(401);

        await connection.query('INSERT INTO transactions (user_id, description, value, type, date) VALUES ($1, $2, $3, $4, $5);', [session.userId, description.trim(), value, type, dayjs()]);
        return res.sendStatus(201);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function listUserTransactions(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) return res.sendStatus(401);

    try {
        const result = await connection.query('SELECT * FROM sessions WHERE token = $1', [token]);
        const session = result.rows[0];

        if (!session) return res.sendStatus(401);

        const transactionsResult = await connection.query(`
            SELECT 
                description, 
                value, 
                type,
                date 
            FROM transactions 
                WHERE "userId" = $1;`, [session.userId]);
        const transactions = transactionsResult.rows;

        return res.status(200).send(transactions);
    } catch {
        return res.sendStatus(500);
    }
}

export {
    createNewTransaction,
    listUserTransactions,
};
