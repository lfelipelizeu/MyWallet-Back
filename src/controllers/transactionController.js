import connection from '../database/database.js';
import * as transactionService from '../services/transactionService.js';
import * as transactionRepository from '../repositories/transactionRepository.js';

async function createNewTransaction(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) return res.sendStatus(401);

    const validationError = transactionService.transactionDataValidationError(req.body);
    if (validationError) return res.status(422).send(validationError.message);
    if (!transactionService.isTransactionTypeValid(req.body.type)) return res.status(422).send('invalid transaction type');

    try {
        const session = await transactionRepository.searchSession(token);
        if (!session) return res.sendStatus(401);

        await transactionRepository.createTransaction(session, req.body);

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
                WHERE user_id = $1;`, [session.userId]);
        const transactions = transactionsResult.rows;

        return res.status(200).send(transactions);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export {
    createNewTransaction,
    listUserTransactions,
};
