import dotenv from 'dotenv';

const envFile = `.env.${process.env.NODE_ENV}`;
// if (process.env.NODE_ENV === 'test') envFile = '.env.test';
// if (process.env.NODE_ENV === 'dev') envFile = '.env.dev';

dotenv.config({
    path: envFile,
});
