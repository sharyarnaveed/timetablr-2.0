const { pool } = require("../database/conn.database.js");


const gettimetable=async(req,res)=>{
    try {
        const{program_id}=req.body;
        console.log(program_id);
   
const sql="SELECT * FROM timetable INNER JOIN programs ON timetable.program_name=programs.program_id where programs.program_id=$1 ";

const responce=await pool.query(sql,[program_id]);
res.json({
    timetable:responce.rows
})
// console.log( responce.rows);


    } catch (error) {
        console.log("error in geting timetable data",error);
    }

}

const deletetimetable=async(req,res)=>
{
    try {
        const{program_id}=req.body;
        console.log(program_id);
   
const sql="DELETE from timetable where program_name=$1";

const responce=await pool.query(sql,[program_id]);
if(responce)
{

    res.json({
        message:"Timetable Deleted",
        success:true
    })
}
    
// console.log( responce.rows);


    } catch (error) {
        console.log("error in geting timetable data",error);
    }
}



module.exports={gettimetable,deletetimetable}