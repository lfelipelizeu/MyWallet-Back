import faker from 'faker';

function createTransaction() {
    const transaction = {
        description: faker.lorem.word(),
        value: Number(faker.finance.amount()),
        type: faker.random.arrayElement(['income', 'outcome']),
    };

    return transaction;
}

export default createTransaction;
