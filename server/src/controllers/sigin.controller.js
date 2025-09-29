const { pool } = require("../database/conn.database.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationsignin } = require("../utility/validationofinput.utility.js");



const signin = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validate required fields
        if (!username || !password) {
            return res.json({
                message: "username and password are required",
                success: false,
            });
        }

        // Validate input format
        const TheCheck = validationsignin(username, password)
        if (TheCheck === false) {
            return res.json({
                message: "Invalid Input",
                success: false,
            });
        }

        // Check if user exists
        const checkusernamequery = 'SELECT * FROM user WHERE username= ?';
        const [responce] = await pool.query(checkusernamequery, [username]);
        
        if (responce.length === 0) {
            return res.json({
                message: "User Not found", 
                success: false,
            });
        }

        // Verify password
        const hashedpassword = responce[0].password;
        const comparepassword = await bcrypt.compare(password, hashedpassword);
        
        if (!comparepassword) {
            return res.json({
                message: "wrong password",
                success: false,
            });
        }

        // Generate tokens
        const user_id = responce[0].user_id;
        const userprogram = responce[0].program;
        
        const accesstoken = await jwt.sign(
            { id: user_id, program: userprogram },
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: "5y" }
        );

        const refreshtoken = await jwt.sign(
            { id: user_id, program: userprogram },
            process.env.REFRESH_TOKEN_KEY,
            { expiresIn: process.env.REFRESH_TIME }
        );

        // Update refresh token in database
        await pool.query(
            "UPDATE user SET refreshtoken =? WHERE user_id= ?",
            [refreshtoken, user_id]
        );

        // Send success response with token
        return res.json({
            message: "Login Successful",
            success: true,
            accesstoken: accesstoken,
        });

    } catch (error) {
        console.log("error signing in", error);
        return res.status(500).json({
            message: "error in signin",
            success: false,
        });
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


const forgotpassword=async(req,res)=>{
    try {
        const {username,email}=req.body

        if(!username||!email)
        {
            return res.json({
                message:"Fields Incomplete",
                success:false
            })
        }

        const sql=`INSERT INTO resetpassword (username,email)
        VALUES (?,?) `
        
        const [responce]=await pool.query(sql,[username,email])

        if(responce)
        {
              return res.json({
                message:"Your Application Has Been Submitted",
                success:true
            })
        }
        else{
            
            return res.json({
                message:"Error In Submission",
                success:false
            })
        }


    } catch (error) {
        console.log("error in changing password");
         return res.json({
                message:"Error In Submission",
                success:false
            })
    }
}
// export { signin,logout }
module.exports = { signin,logout,forgotpassword };
