const { pool } = require("../database/conn.database.js");


const getidTimetable=async(req,res)=>
{
    try {
        
const {id}=req.body
console.log(id);

const sql="SELECT * FROM timetable where program_name=?"
const [responce]=await pool.query(sql,[id]);

return res.json(responce)

    } catch (error) {
        console.log("error in getting timetablr");
        return res.json(error)
    }

}

module.exports= {getidTimetable}