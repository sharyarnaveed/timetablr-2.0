import { pool } from "../database/conn.database.js";
import { validation } from "../utility/validationofinput.utility.js";
import bcrypt from "bcryptjs";

const signup = async (req, res) => {
  

  try {
    // console.log("helloe");
    const {
      fullname,
      username,
      department,
      program,
      password,
      repeatpassword,
    } = req.body;
    console.log(
      fullname,
      username,
      department,
      program,
      password,
      repeatpassword
    );
// check all fields are entered
    if (!username || !department || !program || !password) {
      res.json({
        message: "All fields Required",
        success: false,
      });
    } else {
const responce=validation(fullname,username,department,program,password,repeatpassword)
        if(responce===false)
{
res.json({
    message: "Invalid Input",
    success: false,
})
}
else{

// cehck if passwords match or not
      if (password !== repeatpassword) {
        res.json({
          message: "Passwords DoesNot Match",
          success: false,
        });
      } else {
        // check if user name already exsist or not
        const checkuserQuery =
          'SELECT username from "user" WHERE username = $1';
        const CheckResult = await pool.query(checkuserQuery, [username]);
        if (CheckResult.rows.length > 0) {
          console.log(CheckResult.rows.length);
          res.json({
            message: "Username Already Exist",
            success: false,
          });
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const query =
            'INSERT INTO "user" (full_name, username, department, program,password) VALUES ($1, $2, $3, $4, $5) RETURNING*';
          const user = await pool.query(query, [
            fullname,
            username,
            department,
            program,
            hashedPassword,
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
  }
};

export { signup };
