// import { app } from "./src/app.js";
// import { pool } from "./src/database/conn.database.js";
// import dotenv from 'dotenv'
 
const { app } = require("./src/app.js");
const  {pool}  = require("./src/database/conn.database");
const dotenv = require("dotenv");

dotenv.config({
  path: './.env'
})

// console.log(process.env.HOST_NAME);
async function connectToDatabase() {
  try {
 
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    
 
    connection.release();
    
  
    app.listen(`${process.env.PORT}`||8000, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err)
  }
}
connectToDatabase();
