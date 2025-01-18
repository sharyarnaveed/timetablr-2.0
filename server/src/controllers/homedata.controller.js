// import { pool } from "../database/conn.database.js";
const { pool } = require("../database/conn.database.js");

const getusername = async (user) => {
  const userID = user.id;
  //   console.log("in home data",user.id);

  const query = "SELECT username FROM user WHERE USER_ID =?";
  const [getUserName] = await pool.query(query, [userID]);
  return getUserName;
};

const homedata = async (req, res) => {
  try {
    const user = req.user;
    // console.log("from home",user);
    const { day } = req.body;
    // console.log(day);
    const TimetableQuery = `SELECT * FROM timetable INNER JOIN programs ON timetable.program_name=programs.program_id where day=? And programs.program_name=? ORDER BY STR_TO_DATE(start_time, '%H:%i:%s')`;
    const [TimetableResult] = await pool.query(TimetableQuery, [
     day,
      user.program,
    ]);
    // console.log(TimetableResult);
    const username = await getusername(req.user);
    // console.log("from home",username);

const checkreatcourses="SELECT * FROM timetable INNER JOIN repeatcourses ON timetable.program_name=repeatcourses.program_id AND timetable.course_name=repeatcourses.course_name where day=?  ORDER BY STR_TO_DATE(start_time, '%H:%i:%s')"
const [checkrepeatcourses]=await pool.query(checkreatcourses,[day])
console.log(checkrepeatcourses);
const combinedcourse=[...TimetableResult,...checkrepeatcourses]

    return res.json({
      timetable: combinedcourse,

      username: username,
    });
  } catch (error) {
    console.log("error in getting home data", error);
  }
};

const getalltimetable = async (req, res) => {
  try {
    const UserProgram = req.user.program;
    console.log(UserProgram);

    const sql =
      "SELECT * FROM timetable INNER JOIN programs ON timetable.program_name=programs.program_id where programs.program_name=? ORDER BY STR_TO_DATE(start_time, '%H:%i:%s')";
    const [responce] = await pool.query(sql, [UserProgram]);

    const checkreatcourses="SELECT * FROM timetable INNER JOIN repeatcourses ON timetable.program_name=repeatcourses.program_id AND timetable.course_name=repeatcourses.course_name  ORDER BY STR_TO_DATE(start_time, '%H:%i:%s')"
    const [checkrepeatcourses]=await pool.query(checkreatcourses)
    console.log(checkrepeatcourses);
    const combinedcourse=[...responce,...checkrepeatcourses]


    res.json({
      timetable: combinedcourse,
    });
  } catch (error) {
    console.log("error in getting all timetable", error);
  }
};



const blank=async(req,res)=>{
res.json("good")
}


const getcoursesfromdb = async (req, res) => {
// console.log("from getcoursesfromdb",req.body);

try {
  
const {program}=req.body;
console.log(program);

const sql="SELECT course_name FROM timetable WHERE program_name=? GROUP BY course_name";
const [courses]=await pool.query(sql,[program]);

res.json(courses)

console.log(courses);




} catch (error) {
  console.log("error in getting courses from db", error);
  
}


}

const addCourse=async(req,res)=>
{
  try {
    const user_id=req.user.id
    const {program_id,course}=req.body
    
    console.log(req.body);
    const sql="INSERT INTO repeatcourses (course_name,program_id,user_id) VALUES (?,?,?)";
    const [result]=await pool.query(sql,[course,program_id,user_id])
    console.log(result);
    return res.json({
      success:true,
      message:"Course Added Successfully"
    })
  } catch (error) {
    console.log("error in adding course",error);
    res.json({
      success:false,
      message:"Error in Adding course"
    })
    
  }
}




// export {homedata}
module.exports = { homedata, getalltimetable,blank,getcoursesfromdb,addCourse};
