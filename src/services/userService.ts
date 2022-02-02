import joi from 'joi';
import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import UserEntity from '../entities/UserEntity';

interface NewUser {
    name: string;
    email: string;
    password: string;
}

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

async function createUser(body: NewUser): Promise<void> {
    const { name, email, password } = body;
    const hashPassword = bcrypt.hashSync(password, 10);

    const user = getRepository(UserEntity).create({
        name,
        email,
        password: hashPassword,
    });

    await getRepository(UserEntity).save(user);
}

async function findEmail(email: string): Promise<UserEntity> {
    const user = await getRepository(UserEntity).findOne({ email });
    return user;
}

function isPasswordValid(passwordSent: string, userPassword: string) {
    return (bcrypt.compareSync(passwordSent, userPassword));
}

export {
    signUpDataValidationError,
    createUser,
    findEmail,
    isPasswordValid,
};
