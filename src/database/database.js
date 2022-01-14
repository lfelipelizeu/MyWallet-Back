import pg from 'pg';

const { Pool } = pg;

const databaseConfig = process.env.NODE_ENV === 'production' ? ({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
}) : ({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    // eslint-disable-next-line radix
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
});

const connection = new Pool(databaseConfig);

export default connection;
