

const { pool } = require("../database/conn.database.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationsignin } = require("../utility/validationofinput.utility.js");



const signin = async (req, res) => {
    try {

        const { username, password } = req.body;
        if (!username || !password) {
            res.json({
                message: "username and password are required",
                success: false,
            });
        }

        const TheCheck = validationsignin(username, password)
        if (TheCheck === false) {
            res.json({
                message: "Invalid Input",
                success: false,
            })
        }

        // console.log(username);
        const checkusernamequery = 'SELECT * FROM user WHERE username= ?';
        const [responce] = await pool.query(checkusernamequery, [username]);
          console.log(responce);
        if (responce.length > 0) {
            const hashedpassword = responce[0].password;
            // console.log(hashedpassword);
            // console.log(responce.rows);
            const comparepassword = await bcrypt.compare(password, hashedpassword);
            if (comparepassword) {
                const user_id = responce[0].user_id;
                const userprogram = responce[0].program;
                console.log(user_id,userprogram);
                // generate access token
                const accesstoken = await jwt.sign(
                    { id: user_id, program: userprogram },
                    process.env.ACCESS_TOKEN_KEY,
                    { expiresIn: process.env.ACCESS_TIME }
                );
                // console.log(process.env.ACCESS_TOKEN_KEY);

                // generatae refresh token
                const refreshtoken = await jwt.sign(
                    { id: user_id, program: userprogram },
                    process.env.REFRESH_TOKEN_KEY,
                    { expiresIn: process.env.REFRESH_TIME }
                );
console.log(refreshtoken);
await pool.query(
    "UPDATE user SET refreshtoken =? WHERE user_id= ?",
    [refreshtoken, user_id]
  );

                const options = {
                    httpOnly: true,
                    secure: true,
                    sameSite:'strict',
                    maxAge:7*24*60*60*1000
                };
                res

                    .cookie("accessToken", accesstoken, options)
                    .cookie("refreshToken", refreshtoken, options)

                    .json({
                        message: "Login Successfull",
                        success: true,
                    });
            }
            else {
                res.json({
                    message: "wrong password",
                    success: false,
                });
            }

        } else {
            res.json({
                message: "User Not found",
                success: false,
            });
        }




    } catch (error) {
        console.log("error signing in", error);
        res.json({
            message: "error in signin",
            status: false,
        })
    }

}




const logout=async(req,res)=>
{
    try {
        
        const user_id = req.user.id;
        const rf = "undefined";
        await pool.query('UPDATE user SET refreshtoken =? WHERE user_id= ?', [
          rf,
          user_id,
        ]);
    
        const options = {
          httpOnly: true,
          secure: true,
        };
    
        res.clearCookie("accessToken", options);
        res.clearCookie("refreshToken", options);
        res.json({
          message: "Logged out successfully",
          success: true,
        });
      } catch (error) {
        console.log("error in logout",error);
      }
}

// export { signin,logout }
module.exports = { signin,logout };
