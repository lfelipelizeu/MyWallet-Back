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
        const session = await transactionRepository.searchSession(token);
        if (!session) return res.sendStatus(401);

        const transactions = await transactionRepository.searchTransactions(session.user_id);

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
