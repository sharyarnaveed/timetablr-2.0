import pkg from 'pg';
import { DATABASE_NAME } from '../constants.js';
const { Pool } = pkg;


const pool=new Pool({
    user:'postgres',
    host:'localhost',
    database:DATABASE_NAME,
    password:'1234',
})

// console.log(`${process.env.HOST_NAME}`);


export {pool}