import joi from 'joi';

function transactionDataValidationError(object: Object) {
    const transactionSchema = joi.object({
        description: joi.string().min(1).required(),
        value: joi.number().positive().precision(2).required(),
        type: joi.string().required(),
    });

    const { error } = transactionSchema.validate(object, { convert: false });

    return error;
}

function isTransactionTypeValid(type: string) {
    const validTypes = ['outcome', 'income'];
    return validTypes.includes(type);
}

export {
    transactionDataValidationError,
    isTransactionTypeValid,
};
