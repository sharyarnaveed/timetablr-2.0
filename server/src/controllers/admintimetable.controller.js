const { pool } = require("../database/conn.database.js");

const gettimetable = async (req, res) => {
  try {
    const { program_id } = req.body;
    console.log(program_id);

    const sql =
      "SELECT * FROM timetable INNER JOIN programs ON timetable.program_name=programs.program_id where programs.program_id=? ORDER BY FIELD(day,'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),STR_TO_DATE(start_time, '%H:%i:%s')";

    const [responce] = await pool.query(sql, [program_id]);
    res.json({
      timetable: responce,
    });
  } catch (error) {
    console.log("error in geting timetable data", error);
  }
};

const deletetimetable = async (req, res) => {
  try {
    const { program_id } = req.body;
    console.log(program_id);

    const sql = "DELETE from timetable where program_name=?";

    const [responce] = await pool.query(sql, [program_id]);
    if (responce) {
      res.json({
        message: "Timetable Deleted",
        success: true,
      });
    }

    // console.log( responce.rows);
  } catch (error) {
    console.log("error in geting timetable data", error);
  }
};

const getuserinfo = async (req, res) => {
  try {
    const sql = "SELECT * FROM user";
    const [responce] = await pool.query(sql);
    // console.log(responce);/
    res.json({
      user: responce,
    });
  } catch (error) {
    console.log("error in getting users", error);
  }
};

const UpdateTimeTable = async (req, res) => {
  try {
    const { timetableID, day, starttime, endtime, coursename } = req.body;
    // console.log(req.body);
    const sql =
      "update timetable set day=?, start_time=?, end_time=?,course_name=? where timetable_id=?";

    const [responce] = await pool.query(sql, [
      day,
      starttime,
      endtime,
      coursename,
      timetableID,
    ]);
    // console.log(responce);

    res.json({
      success: true,
      message: "updated",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  gettimetable,
  deletetimetable,
  getuserinfo,
  UpdateTimeTable,
};
