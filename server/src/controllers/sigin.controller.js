import { pool } from "../database/conn.database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationsignin } from "../utility/validationofinput.utility.js";

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
        const checkusernamequery = 'SELECT * FROM "user" WHERE username= $1';
        const responce = await pool.query(checkusernamequery, [username]);
        //   console.log(responce);
        if (responce.rows.length > 0) {
            const hashedpassword = responce.rows[0].password;
            // console.log(hashedpassword);
            // console.log(responce.rows);
            const comparepassword = await bcrypt.compare(password, hashedpassword);
            if (comparepassword) {
                const user_id = responce.rows[0].user_id;
                // console.log(user_id);
                const userprogram = responce.rows[0].program;
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

                await pool.query(
                    'UPDATE "user" SET refreshtoken =$1 WHERE user_id= $2',
                    [refreshtoken, user_id]
                );

                const options = {
                    httpOnly: true,
                    secure: true,
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



export { signin }