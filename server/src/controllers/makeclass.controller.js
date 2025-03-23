const { pool } = require("../database/conn.database.js");

const getCoursesformake = async (req, res) => {
  try {
    const program = req.user.program;

    const query = `  SELECT course_name FROM timetable 
      INNER JOIN programs ON timetable.program_name = programs.program_id 
      WHERE  programs.program_name = ? GROUP BY course_name`;

    const [row] = await pool.query(query, [program]);
console.log(row);

    return res.json(row);
  } catch (error) {
    console.log("error in getting courses");
  }
};

const addMakeupClass = async (req, res) => {
  try {
    const { course, Starttime, Endtime, date } = req.body;
    console.log(course, Starttime, Endtime, date);

    const userid = req.user.id;
    const program = req.user.program;

    const query =
      "INSERT INTO makeupclass (coursename,programname,userid,starttime,endtime,date) VALUES (?,?,?,?,?,?)";
    const [rows] = await pool.query(query, [
      course,
      program,
      userid,
      Starttime,
      Endtime,
      date,
    ]);

    return res.json({
      message: "Make class Added",
      success: true,
    });
  } catch (error) {
    console.log("error in adding make up class", error);
  }
};

const viewMakeupclasses = async (req, res) => {
  try {
    const program = req.user.program;
    const userid = req.user.id;

    const query = "select * from makeupclass where programname=? and userid=?";

    const [result] = await pool.query(query, [program, userid]);
    res.json(result);
  } catch (error) {
    console.log("error in viewing make up classes", error);
  }
};

const deletemakeclass = async (req, res) => {
  try {
    const { makeupid } = req.body;

    const query = "DELETE FROM makeupclass WHERE id=?";
    const [result] = await pool.query(query, [makeupid]);

    return res.json({
      message: "Makeup class deleted",
      success: true,
    });
  } catch (error) {
    console.log("error in deleting make up class", error);
  }
};

module.exports = {
  getCoursesformake,
  addMakeupClass,
  viewMakeupclasses,
  deletemakeclass,
};
