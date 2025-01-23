const { pool } = require("../database/conn.database.js");


const viewcourse=async(req,res)=>
{
    try {
        const user_id=req.user.id;
const sql="SELECT * FROM repeatcourses WHERE user_id=?";
const [responce]=await pool.query(sql,[user_id]);

res.json({
    repeatcourses:responce
})


    } catch (error) {
        console.log("error in getting courses",error);
        
    }
}


const deletecourse=async(req,res)=>
{
    try {
        
const user_id=req.user.id;
const {repeatId}=req.body;

console.log(repeatId);

const sql="DELETE FROM `repeatcourses` WHERE user_id=? and repeat_id=?"
const [responce]=await pool.query(sql,[user_id,repeatId]);

console.log(responce);
if (responce) {
    return res.json({
        message:"Course Deleted",
        success:true
    })
}


    } catch (error) {
        console.log("error in deleteing",error);
        return res.json({
            message:"Error in Deleting",
            success:false
        })
    }
}



module.exports={
    viewcourse,
    deletecourse
}