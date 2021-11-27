import dayjs from 'dayjs';
import connection from '../database/database.js';

async function searchSession(token) {
    const result = await connection.query('SELECT *, user_id as "userId" FROM sessions WHERE token = $1 LIMIT 1;', [token]);
    const session = result.rows[0];

    return session;
}

async function createTransaction(session, body) {
    const { description, value, type } = body;
    await connection.query('INSERT INTO transactions (user_id, description, value, type, date) VALUES ($1, $2, $3, $4, $5);', [session.userId, description.trim(), value, type, dayjs()]);
}

async function searchTransactions(userId) {
    const result = await connection.query(`
            SELECT 
                description, 
                value, 
                type,
                date 
            FROM transactions 
                WHERE user_id = $1;`, [userId]);
    const transactions = result.rows;

    return transactions;
}

export {
    searchSession,
    createTransaction,
    searchTransactions,
};
