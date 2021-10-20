import joi from 'joi';

const validateSignin = joi.object({
    name: joi.string().trim().min(3).required(),
    email: joi.string().trim().email().required(),
    password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required(),
    repeatPassword: joi.ref('password')
}).with('password', 'repeatPassword');

export {
    validateSignin
}