const { pool } = require("../database/conn.database.js");

const getrepeatadmin = async (req, res) => {
  try {
    const sql =
      "SELECT * FROM repeatcourses INNER JOIN user ON repeatcourses.user_id = user.user_id";

    const [repsonce] = await pool.query(sql);
    res.json(repsonce);
  } catch (error) {
    console.log("error in getting courses", error);
  }
};

module.exports = {
  getrepeatadmin,
};
