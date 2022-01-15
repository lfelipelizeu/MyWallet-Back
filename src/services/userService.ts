import joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import * as userRepository from '../repositories/userRepository';

function signUpDataValidationError(object: Object) {
    const signUpSchema = joi.object({
        name: joi.string().trim().min(1).required(),
        email: joi.string().trim().email().required(),
        password: joi.string().required(),
        repeatPassword: joi.ref('password'),
    }).with('password', 'repeatPassword');

    const { error } = signUpSchema.validate(object);

    return error;
}

async function createUser(body: any) {
    const hashPassword = bcrypt.hashSync(body.password, 10);
    // eslint-disable-next-line no-param-reassign
    body.password = hashPassword;
    await userRepository.insertUser(body);
}

function isPasswordValid(passwordSent: string, userPassword: string) {
    return (bcrypt.compareSync(passwordSent, userPassword));
}

async function createNewSession(userId: number) {
    const token = uuid();
    await userRepository.insertSession(userId, token);
    return token;
}

export {
    signUpDataValidationError,
    createUser,
    isPasswordValid,
    createNewSession,
};