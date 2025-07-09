const { app } = require("./src/app.js");
const { pool } = require("./src/database/conn.database");
const dotenv = require("dotenv");

dotenv.config({ path: './.env' });

async function connectToDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.log(err);
  }
}

connectToDatabase();
