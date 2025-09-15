const { pool } = require("../database/conn.database.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  validationpassword,
} = require("../utility/validationofinput.utility.js");
const passwordreset = async (req, res) => {
  try {
    const { newpassword, username } = req.body;
    console.log(newpassword, username);

    if (!newpassword || !username) {
      return res.json({
        message: "Fields Missing",
        success: false,
      });
    }
    const check = await validationpassword(newpassword);
    console.log(check);

    if (check !== true) {
      return res.json({
        message: "Invalid Input",
        success: false,
      });
    }

    const hashednewpass = await bcrypt.hash(newpassword, 10);
    console.log(hashednewpass);

    if (!hashednewpass) {
      return res.json({
        message: "Error in Hashing Password",
        success: false,
      });
    }

    const sql = "UPDATE user SET password=? WHERE username=?";
    const [update] = await pool.query(sql, [hashednewpass, username]);
    if (update) {
      const sqlstatus = `UPDATE resetpassword SEt status=1 where username=?`;
      const [updatestatus] = await pool.query(sqlstatus, [username]);
      if (updatestatus) {
        return res.json({
          message: "Password Changed Successfully",
          success: true,
        });
      }
    }
  } catch (error) {
    console.log("error in resetting password", error);
  }
};

const getpasswordreset = async (req, res) => {
  try {
    const sql = "SELECT * from resetpassword WHERE status=0";
    const [user] = await pool.query(sql);

    if (!user) {
      return res.json({
        message: "error in getting user",
        success: false,
      });
    }

    return res.json({
      data: user,
      success: true,
    });
  } catch (error) {
    console.log("error in getting password reset people", error);
  }
};

module.exports = {
  getpasswordreset,
  passwordreset,
};
