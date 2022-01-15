import connection from '../database';

async function hasEmailConflict(email: string) {
    const result = await connection.query('SELECT * FROM users WHERE email = $1 LIMIT 1;', [email]);
    if (result.rows[0]) return true;
    return false;
}

async function insertUser(body: any) {
    const { name, email, password } = body;
    await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3);', [name, email, password]);
}

async function searchEmail(email: string) {
    const result = await connection.query('SELECT * FROM users WHERE email = $1 LIMIT 1;', [email.trim()]);
    const user = result.rows[0];

    return user;
}

async function searchExistingSession(userId: number) {
    const result = await connection.query('SELECT * FROM sessions WHERE user_id = $1 LIMIT 1;', [userId]);
    const session = result.rows[0];

    return session;
}

async function insertSession(userId: number, token: string) {
    await connection.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2);', [userId, token]);
}

export {
    hasEmailConflict,
    insertUser,
    searchEmail,
    searchExistingSession,
    insertSession,
};
