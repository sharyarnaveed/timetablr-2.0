// import { pool } from "../database/conn.database.js";
const { pool } = require("../database/conn.database.js");


const getusername = async (user) => {
   
  
      const userID = user.id
    //   console.log("in home data",user.id);
  
  
      const query = 'SELECT username FROM user WHERE USER_ID =?'
      const [getUserName] = await pool.query(query, [userID]);
      return getUserName
  
    
  }



const homedata=async(req,res)=>
{
    try {
        const user=req.user
        // console.log("from home",user);
        const { day } = req.body;
        // console.log(day);
const TimetableQuery=`SELECT * FROM timetable INNER JOIN programs ON timetable.program_name=programs.program_id where day=? And programs.program_name=? ORDER BY STR_TO_DATE(start_time, '%H:%i:%s')`;
const [TimetableResult]=await pool.query(TimetableQuery,[day,user.program]);
// console.log(TimetableResult);
const username = await getusername(req.user)
// console.log("from home",username);
return res.json({
  timetable: TimetableResult,
  username: username
});
    } catch (error) {
        console.log("error in getting home data",error);
    }
}

// export {homedata}
module.exports = { homedata };
