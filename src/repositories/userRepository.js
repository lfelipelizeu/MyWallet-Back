import connection from '../database/database';

async function hasEmailConflict(email) {
    const result = await connection.query('SELECT * FROM users WHERE email = $1 LIMIT 1;', [email]);
    if (result.rows[0]) return true;
    return false;
}

async function insertUser(body) {
    const { name, email, password } = body;
    await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3);', [name, email, password]);
}

export {
    hasEmailConflict,
    insertUser,
};
