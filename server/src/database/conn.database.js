import pkg from 'pg';
import { DATABASE_NAME } from '../constants.js';
const { Pool } = pkg;


const pool = new Pool({
    user: `${process.env.USER}`,
    host: `${process.env.HOST_NAME}`,
    database: DATABASE_NAME,
    password: `${process.env.PASSWORD}`
})




export { pool }