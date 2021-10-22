import joi from 'joi';

function isSignUpDataValid (object) {
    const signUpSchema = joi.object({
        name: joi.string().trim().min(3).required(),
        email: joi.string().trim().email().required(),
        password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).pattern(/\s/, { invert: true }).min(5).required(),
        repeatPassword: joi.ref('password')
    }).with('password', 'repeatPassword');

    const { error } = signUpSchema.validate(object);

    return !joi.isError(error);
}

export {
    isSignUpDataValid
}