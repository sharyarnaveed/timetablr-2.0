// import { pool } from "../database/conn.database.js";
const { pool } = require("../database/conn.database.js");


const getusername = async (user) => {
   
  
      const userID = user.id
    //   console.log("in home data",user.id);
  
  
      const query = 'SELECT username FROM "user" WHERE USER_ID =$1'
      const getUserName = await pool.query(query, [userID]);
      return getUserName.rows
  
    
  }



const homedata=async(req,res)=>
{
    try {
        const user=req.user
        // console.log("from home",user);
        const { day } = req.body;
        // console.log(day);
const TimetableQuery=`SELECT * FROM timetable INNER JOIN programs ON timetable.program_name=programs.program_id where day=$1 And programs.program_name=$2`;
const TimetableResult=await pool.query(TimetableQuery,[day,user.program]);
console.log(TimetableResult.rows);
const username = await getusername(req.user)
// console.log("from home",username);
return res.json({
  timetable: TimetableResult.rows,
  username: username
});
    } catch (error) {
        console.log("error in getting home data",error);
    }
}

// export {homedata}
module.exports = { homedata };
