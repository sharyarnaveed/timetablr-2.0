const { pool } = require("../database/conn.database.js");
const { validation } = require("../utility/validationofinput.utility.js");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    // console.log("helloe");
    const {
      fullname,
      username,
      department,
      program,
      password,
      repassword,
      agree,
    } = req.body;

    // check all fields are entered
    if (!username || !department || !program || !password || !agree) {
      return res.json({
        message: "All fields Required",
        success: false,
      });
    } else {
      const responce = validation(
        fullname,
        username,
        department,
        password,
        repassword
      );
      if (responce === false) {
        console.log(responce);
        res.json({
          message: "Invalid Input",
          success: false,
        });
      } else {
        // cehck if passwords match or not
        if (password !== repassword) {
          res.json({
            message: "Passwords DoesNot Match",
            success: false,
          });
        } else {
          // check if user name already exsist or not
          const checkuserQuery = "SELECT username from user WHERE username = ?";
          const [CheckResult] = await pool.query(checkuserQuery, [username]);
          if (CheckResult.length > 0) {
            console.log(CheckResult.length);
            res.json({
              message: "Username Already Exist",
              success: false,
            });
          } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const query =
              "INSERT INTO user (full_name, username, department, program,password,agree) VALUES (?, ?, ?, ?, ?,?)";
            const [user] = await pool.query(query, [
              fullname,
              username,
              department,
              program,
              hashedPassword,
              agree,
            ]);

            res.json({
              message: "User Created Successfully",
              success: true,
            });
          }
        }
      }
    }
  } catch (error) {
    console.log("error in signing up", error);
    res.json({
      message: "Error",
      success: false,
    });
  }
};

const getprogram = async (req, res) => {
  try {
    // // console.log(thedb);
    const [result] = await pool.query(`SELECT * FROM programs`);

    res.json(result);
  } catch (error) {
    console.log("error in getting programs", error);
  }
};

// export { signup };
module.exports = { signup, getprogram };
