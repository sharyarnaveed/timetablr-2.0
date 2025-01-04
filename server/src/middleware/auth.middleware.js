// import jwt, { decode } from 'jsonwebtoken';\
const jwt = require("jsonwebtoken");
const { decode } = jwt;

const verifyjwt = async (req, res, next) => {
  try {
    // Get tokens from cookies or Authorization header
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    const refreshToken = req.cookies?.refreshToken;

    // Helper function to generate new access token
    const generateNewAccessToken = async (userData) => {
      console.log("auth user data", userData);
      const newAccessToken = jwt.sign(
        { id: userData.id, program: userData.program },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: process.env.ACCESS_TIME }
      );

      // Set cookie options
      const cookieOptions = {
        httpOnly: true,
        secure: true, // Only true in production
      };

      res.cookie("accessToken", newAccessToken, cookieOptions);
      return newAccessToken;
    };

    // Case 1: No access token present
    if (!accessToken) {
      if (!refreshToken) {
        return res.status(401).json({
          message: "Unauthorized, no tokens provided",
          success: false,
        });
      }

      // // Try to verify refresh token and generate new access token
      try {
        const refreshData = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_KEY
        );
        console.log("refresh data", refreshData);
        await generateNewAccessToken(refreshData);

        // res.json({
        //     message:"access token generated succesfully"
        // })
        req.user = refreshData;
        return next();
      } catch (refreshError) {
        return res.status(401).json({
          message: "Invalid or expired refresh token",
          success: false,
        });
      }
    }

    if (accessToken) {
      // Case 2: Access token present
      try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
        console.log("auth", decoded);
        req.user = decoded;
        return next();
      } catch (accessError) {
        //     // If access token is expired and refresh token exists
        if (accessError.name === "TokenExpiredError" && refreshToken) {
          try {
            const refreshData = jwt.verify(
              refreshToken,
              process.env.REFRESH_TOKEN_KEY
            );
            await generateNewAccessToken(refreshData);

            req.user = refreshData;
            return next();
          } catch (refreshError) {
            return res.status(401).json({
              message: "Invalid or expired refresh token",
              success: false,
            });
          }
        }

        return res.status(401).json({
          message: "Unauthorized, invalid access token",
          success: false,
        });
      }
    }
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports = { verifyjwt };
