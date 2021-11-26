import faker from 'faker';

function createUser() {
    const user = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(8),
    };

    user.repeatPassword = user.password;

    return user;
}

export default createUser;
