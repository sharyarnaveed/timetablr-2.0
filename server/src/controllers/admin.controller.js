const { pool } = require("../database/conn.database.js");




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

  const deletprogram=async(req,res)=>
    {
      try {
        
    const id=req.body.id;
    
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
        console.log("error deleting project",error);
      }
    }

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




  module.exports = { addprogram,deletprogram,graph };
