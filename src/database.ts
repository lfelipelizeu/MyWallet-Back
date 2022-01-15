import { Pool } from 'pg';

const databaseConfig = process.env.NODE_ENV === 'production' ? ({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
}) : ({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
});

const connection = new Pool(databaseConfig);

export default connection;
