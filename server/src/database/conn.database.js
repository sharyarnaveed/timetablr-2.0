// import pkg from 'pg';
// import { DATABASE_NAME } from '../constants.js';
// const { Pool } = pkg;
const mysql = require('mysql2/promise');


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prosxwdx_timetablr',
   
  });

// console.log(`${process.env.HOST_NAME}`);


// export {pool}
module.exports = { pool };
