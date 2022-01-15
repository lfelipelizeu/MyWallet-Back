import faker from 'faker';

function createUser() {
    let id: number;
    let repeatPassword: string;

    const user = {
        id,
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(8),
        repeatPassword,
    };

    user.repeatPassword = user.password;

    return user;
}

export default createUser;
