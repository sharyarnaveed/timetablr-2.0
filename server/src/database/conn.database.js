
const mysql = require('mysql2/promise');


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prosxwdx_timetablr',
   
  });




// export {pool}
module.exports = { pool };
