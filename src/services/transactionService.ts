import { getRepository } from 'typeorm';
import joi from 'joi';
import TransactionEntity from '../entities/TransactionEntity';

interface NewTransaction {
    description: string;
    value: number;
    type: string;
}

function transactionDataValidationError(object: NewTransaction): joi.ValidationError {
    const transactionSchema = joi.object({
        description: joi.string().min(1).required(),
        value: joi.number().positive().precision(2).required(),
        type: joi.string().required(),
    });

    const { error } = transactionSchema.validate(object, { convert: false });

    return error;
}

function isTransactionTypeValid(type: string): boolean {
    const validTypes = ['outcome', 'income'];
    return validTypes.includes(type);
}

async function createTransaction(userId: number, body: NewTransaction): Promise<void> {
    const { description, value, type } = body;

    const newTransaction = getRepository(TransactionEntity).create({
        user: {
            id: userId,
        },
        description,
        value,
        type,
        date: new Date(),
    });

    await getRepository(TransactionEntity).save(newTransaction);
}

async function listTransactions(userId: number): Promise<TransactionEntity[]> {
    const transactions = await getRepository(TransactionEntity).find({
        user: {
            id: userId,
        },
    });

    return transactions;
}

export {
    transactionDataValidationError,
    isTransactionTypeValid,
    createTransaction,
    listTransactions,
};
