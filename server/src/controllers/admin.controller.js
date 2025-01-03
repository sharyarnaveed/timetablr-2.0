const { pool } = require("../database/conn.database.js");
const { timeformate } = require("../utility/timeformate.js");

const addprogram = async (req, res) => {
  try {
    const { programname } = req.body;

    console.log(programname);
    // Insert program into the programs table
    const sql = `INSERT INTO programs (program_name) VALUES ($1)`;
    const inserted = await pool.query(sql, [programname]);
    //   console.log(inserted);
    if (inserted.rowCount > 0) {
      res.status(200).json({
        message: "Program added ",
        success: true,
      });
    } else {
      res.status(500).json({
        message: "Failed to add program",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};

const deletprogram = async (req, res) => {
  try {
    const id = req.body.id;

    console.log(id);
    const sql = `DELETE FROM programs WHERE program_id=$1`;
    const deleted = await pool.query(sql, [id]);
    console.log(deleted);
    if (deleted.rowCount > 0) {
      res.status(200).json({
        message: "Program deleted ",
        success: true,
      });
    } else {
      res.status(500).json({
        message: "Failed to delete program",
        success: false,
      });
    }
  } catch (error) {
    console.log("error deleting project", error);
  }
};

const graph = async (req, res) => {
  const query = `
     SELECT
    TO_CHAR(time, 'YYYY-MM-01') AS month, 
    COUNT(*) AS userCount
FROM "user"
GROUP BY month
ORDER BY month ASC;

      
        `;
  try {
    const result = await pool.query(query);
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.log(error);
  }
};


const uploadtimetable=async(req,res)=>
{
  try {
    const data=req.body;
const sql="INSERT INTO timetable (day,start_time,end_time,program_name,course_name,teacher_name,venue) VALUES ($1,$2,$3,$4,$5,$6,$7) "




await data.forEach(async(element) => {
  const days=element[0];
  const start_time=element[1];
  const Cstarttime=await timeformate(start_time)
  const end_time=element[2];
  const Cendtime=await timeformate(end_time)
  const course_name=element[3]
  const teacher_name=element[4]
  const venue=element[5]
  const program_name=element[6]
  const submition=await pool.query(sql,[
    days,
    Cstarttime,
    Cendtime,
    program_name,
    course_name,
    teacher_name,
    venue
])


});
res.json({
  message:"Timetable Upload",
  success:true
})

    // console.log(data);
  } catch (error) {
    console.log("error uploadin g excel",error);
  }
}



module.exports = { addprogram, deletprogram, graph,uploadtimetable };
