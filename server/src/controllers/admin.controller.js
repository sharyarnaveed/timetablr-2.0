const { pool } = require("../database/conn.database.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { timeformate } = require("../utility/timeformate.js");

const addprogram = async (req, res) => {
  try {
    const { programname } = req.body;

    // console.log(programname);
    // Insert program into the programs table
    const sql = `INSERT INTO programs (program_name) VALUES (?)`;
    const [inserted] = await pool.query(sql, [programname]);
    console.log(inserted);
    if (inserted.affectedRows > 0) {
      console.log(inserted);
     return res.json({
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
    const sql = `DELETE FROM programs WHERE program_id=?`;
    const [deleted] = await pool.query(sql, [id]);
    console.log(deleted);
    if (deleted.affectedRows > 0) {
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
  DATE_FORMAT(time, '%Y-%m-01') AS month, -- Extracts the month as 'YYYY-MM-01'
  COUNT(*) AS userCount
FROM user
GROUP BY month
ORDER BY month ASC;

      
        `;
  try {
    const [result] = await pool.query(query);
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

const uploadtimetable = async (req, res) => {
  try {
    const data = req.body;
    const sql =
      "INSERT INTO timetable (day,start_time,end_time,program_name,course_name,teacher_name,venue) VALUES (?,?,?,?,?,?,?) ";

    await data.forEach(async (element) => {
      const days = element[0];
      const start_time = element[1];
      const Cstarttime = await timeformate(start_time);
      const end_time = element[2];
      const Cendtime = await timeformate(end_time);
      const course_name = element[3];
      const teacher_name = element[4];
      const venue = element[5];
      const program_name = element[6];
      const [submition] = await pool.query(sql, [
        days,
        Cstarttime,
        Cendtime,
        program_name,
        course_name,
        teacher_name,
        venue,
      ]);
    });
    
    res.json({
      message: "Timetable Upload",
      success: true,
    });

    // console.log(data);
  } catch (error) {
    console.log("error uploadin g excel", error);
  }
};

const adminsigin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    const query = "SELECT * FROM admin WHERE admin_username = ?";
    const [result1] = await pool.query(query, [username]);
    if (result1.length > 0) {
      console.log(result1);
      const hashedPassword = result1[0].admin_password;
      console.log(hashedPassword);
      const isValid = await bcrypt.compare(password, hashedPassword);
      if (isValid) {
        const admin_id = result1[0].admin_id;
        // // generatge access tooken
        const accesstoken = await jwt.sign(
          { id: admin_id },
          process.env.ACCESS_TOKEN_KEY,
          { expiresIn: process.env.ACCESS_TIME }
        );
        // // generate refresh token

        const refreshtoken = await jwt.sign(
          { id: admin_id },
          process.env.REFRESH_TOKEN_KEY,
          { expiresIn: process.env.REFRESH_TIME }
        );

        // // update refresh token in database
        await pool.query(
          "UPDATE admin SET refreshtoken =? WHERE admin_id= ?",
          [refreshtoken, admin_id]
        );

        const options = {
          httpOnly: true,
          secure: true,
        };
        res

          .cookie("adminaccessToken", accesstoken, options)
          .cookie("adminrefreshToken", refreshtoken, options)
          .json({
            message: "Login Successfull",
            success: true,
          });
      } else {
        res.json({ message: "Wrong Credentials", status: 401, success: false });
      }
    } else {
      res.json({
        message: "User Not Found",
        success: false,
      });
    }
  } catch (error) {
    console.log(error, "error in admin sign in");
  }
};

const logout = async (req, res) => {
  try {
    const admin_id = req.user.admin_id;
    console.log(admin_id);
    const rf = "undefined";
    await pool.query("UPDATE admin SET refreshtoken =? WHERE admin_id= ?", [
      rf,
      admin_id,
    ]);

    const options = {
      httpOnly: true,
      secure: true,
    };

    res.clearCookie("adminaccessToken", options);
    res.clearCookie("adminrefreshToken", options);
    res.json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log("error in logout", error);
  }
};

module.exports = {
  addprogram,
  deletprogram,
  graph,
  uploadtimetable,
  adminsigin,
  logout,
};
