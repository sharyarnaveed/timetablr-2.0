const { pool } = require("../database/conn.database.js");

const getusername = async (user) => {
  const userID = user.id;


  const query = "SELECT username FROM user WHERE USER_ID =?";
  const [getUserName] = await pool.query(query, [userID]);
  return getUserName;
};

const homedata = async (req, res) => {
  try {
    const user = req.user;
    const user_id = req.user.id;
    const { day, MakeupDate } = req.body;

    const TimetableQuery = `
      SELECT * FROM timetable 
      INNER JOIN programs ON timetable.program_name = programs.program_id 
      WHERE day = ? AND programs.program_name = ? 
      ORDER BY STR_TO_DATE(start_time, '%H:%i:%s')
    `;
    const [TimetableResult] = await pool.query(TimetableQuery, [
      day,
      user.program,
    ]);

    const username = await getusername(req.user);

    const checkreatcourses = `
      SELECT * FROM timetable 
      INNER JOIN repeatcourses ON timetable.program_name = repeatcourses.program_id 
      AND timetable.course_name = repeatcourses.course_name 
      WHERE day = ? AND user_id = ? 
      ORDER BY STR_TO_DATE(start_time, '%H:%i:%s')
    `;
    const [checkrepeatcourses] = await pool.query(checkreatcourses, [
      day,
      user_id,
    ]);

    const makeclassQuery = `SELECT date,start_time,end_time,program_name,course_name,venue FROM makeupclass INNER JOIN user ON makeupclass.userid=user.user_id where userid=? and date=?`;
    const [Makaeupresult] = await pool.query(makeclassQuery, [
      user_id,
      MakeupDate,
    ]);

    const combinedcourse = [
      ...TimetableResult,
      ...checkrepeatcourses,
      ...Makaeupresult,
    ];

    return res.json({
      success: true,
      timetable: combinedcourse,
      username: username,
      UserProgram: req.user.program,
    });
  } catch (error) {
    console.error("Error in getting home data:", error);
    return res.status(500).json({
      success: false,
      message: "Error in getting home data",
    });
  }
};

const getalltimetable = async (req, res) => {
  try {
    const UserProgram = req.user.program;
    const user_id = req.user.id;
    if (!UserProgram) {
      return res.status(400).json({
        success: false,
        message: "User program not specified",
      });
    }

    const sql = `
      SELECT * FROM timetable 
      INNER JOIN programs ON timetable.program_name = programs.program_id 
      WHERE programs.program_name = ? 
      ORDER BY STR_TO_DATE(start_time, '%H:%i:%s')
    `;
    const [responce] = await pool.query(sql, [UserProgram]);

    const checkreatcourses = `
      SELECT * FROM timetable 
      INNER JOIN repeatcourses ON timetable.program_name = repeatcourses.program_id 
      AND timetable.course_name = repeatcourses.course_name where user_id=?
      ORDER BY STR_TO_DATE(start_time, '%H:%i:%s')
    `;
    const [checkrepeatcourses] = await pool.query(checkreatcourses, [user_id]);
    const combinedcourse = [...responce, ...checkrepeatcourses];

    return res.json({
      success: true,
      timetable: combinedcourse,
    });
  } catch (error) {
    console.error("Error in getting all timetable:", error);
    return res.status(500).json({
      success: false,
      message: "Error in getting all timetable",
    });
  }
};

const getcoursesfromdb = async (req, res) => {
  // console.log("from getcoursesfromdb",req.body);

  try {
    const { program } = req.body;
    console.log(program);

    const sql =
      "SELECT course_name FROM timetable WHERE program_name=? GROUP BY course_name";
    const [courses] = await pool.query(sql, [program]);

    res.json(courses);

    console.log(courses);
  } catch (error) {
    console.log("error in getting courses from db", error);
  }
};

const addCourse = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { program_id, course } = req.body;

    console.log(req.body);
    const sql =
      "INSERT INTO repeatcourses (course_name,program_id,user_id) VALUES (?,?,?)";
    const [result] = await pool.query(sql, [course, program_id, user_id]);
    console.log(result);
    return res.json({
      success: true,
      message: "Course Added Successfully",
    });
  } catch (error) {
    console.log("error in adding course", error);
    res.json({
      success: false,
      message: "Error in Adding course",
    });
  }
};

const blank = async (req, res) => {
  res.json("good");
};

module.exports = {
  homedata,
  getalltimetable,
  getcoursesfromdb,
  addCourse,
  blank,
};
