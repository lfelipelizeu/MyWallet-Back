import joi from 'joi';

function isTransactionDataValid (object) {
    const transactionSchema = joi.object({
        description: joi.string().min(1).max(50).required(),
        value: joi.number().positive().precision(2).required(),
        type: joi.string().required()
    });

    const { error } = transactionSchema.validate(object, { convert: false });

    return !joi.isError(error);
}

export {
    isTransactionDataValid,
}