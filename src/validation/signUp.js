import joi from 'joi';

function isSignUpDataValid (object) {
    const signUpSchema = joi.object({
        name: joi.string().trim().min(1).required(),
        email: joi.string().trim().email().required(),
        password: joi.string().required(),
        repeatPassword: joi.ref('password')
    }).with('password', 'repeatPassword');

    const { error } = signUpSchema.validate(object);

    return !joi.isError(error);
}

export {
    isSignUpDataValid
}