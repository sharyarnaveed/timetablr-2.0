
const { pool } = require("../database/conn.database.js");
const bcrypt = require("bcryptjs");
const { validationpassword } = require("../utility/validationofinput.utility.js");


const changepassword = async (req, res) => {

  try {

    const user_id = req.user.id;
    console.log(user_id);
    const { oldpassword, newpassword } = req.body;

    if (!oldpassword || !newpassword) {
      res.json({
        message: "Fill The Form"
      })
    }
    else {



      const Check = await validationpassword(newpassword)
      if (Check === false) {
        res.json({
          message: "Invalid Input",
          success: false
        })
      }
      else {
        const hashednewpass = await bcrypt.hash(newpassword, 10);


        // compare old password first
        const oldpasscheck = 'SELECT password from user WHERE user_id=?'
        const [check] = await pool.query(oldpasscheck, [user_id])
        if (check.length > 0) {
          console.log(check[0].password);
          const hashedpassword = check[0].password
          const comparepassword = await bcrypt.compare(oldpassword, hashedpassword)

          if (comparepassword) {
            const query = 'UPDATE user SET password=? WHERE user_id=?';
            const [update] = await pool.query(query, [hashednewpass, user_id]);
            console.log(update);

            res.json({
              message: "Password Changed Successfully",
            })
          }
          else {
            res.json({
              message: "Old Password is Incorrect",
            })
          }


          console.log(comparepassword);

        }
      }

    }

  } catch (error) {
    console.log(error);

  }

}

const changeusername = async (req, res) => {
  try {
    const { username } = req.body;
    const user_id = req.user.id;
    console.log(user_id);

    const checkusernamequery = 'SELECT username FROM user WHERE username=?';
    const [checkusername] = await pool.query(checkusernamequery, [username]);
    if (checkusername.length > 0) {
      res.json({
        message: "Username ALready Taken"
      })
    }
    else {
      const changenamequery = 'UPDATE user SET username=? WHERE user_id=?';
      const [change] = await pool.query(changenamequery, [username, user_id])

      console.log(change);
      res.json({
        message: "UserName Changed"
      })

    }



  } catch (error) {
    console.log(error);
    res.json({
      message: "Error In Changing Password"
    })
  }
}


// export {changepassword,changeusername} 
module.exports = { changepassword, changeusername };
