// import { config as configDotenv } from 'dotenv';
// import { Sequelize } from 'sequelize';

// Initialize dotenv
// configDotenv();

// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASS,
//     {
//         host: process.env.DB_HOST,
//         dialect: 'postgres',
//         port: process.env.DB_PORT,
//         // logging: console.log,
//     }
// );

// export default sequelize;

import { config as configDotenv } from 'dotenv';
import * as pg from 'pg';
const { Pool } = pg.default;

// Initialize dotenv
configDotenv();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

export default pool;