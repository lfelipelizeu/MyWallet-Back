import dotenv from 'dotenv';

const envFile = `.env.${process.env.NODE_ENV}`;

dotenv.config({
    path: envFile,
});
