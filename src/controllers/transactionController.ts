import { Request, Response } from 'express';
import * as sessionService from '../services/sessionService';
import * as transactionService from '../services/transactionService';

async function createNewTransaction(req: Request, res: Response) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) return res.sendStatus(401);

    const validationError = transactionService.transactionDataValidationError(req.body);
    if (validationError) return res.status(422).send(validationError.message);
    if (!transactionService.isTransactionTypeValid(req.body.type)) return res.status(422).send('invalid transaction type');

    try {
        const session = await sessionService.findSession(token);
        if (!session) return res.sendStatus(401);

        await transactionService.createTransaction(session.user.id, req.body);

        return res.sendStatus(201);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function listUserTransactions(req: Request, res: Response) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.sendStatus(401);

    try {
        const session = await sessionService.findSession(token);
        if (!session) return res.sendStatus(401);

        const transactions = await transactionService.listTransactions(session.user.id);

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
