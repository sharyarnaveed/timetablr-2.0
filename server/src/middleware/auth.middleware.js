const jwt = require("jsonwebtoken");

const verifyjwt = async (req, res, next) => {
  try {
    // Get access token from Authorization header or cookie
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    const refreshToken = req.cookies?.refreshToken;

    // Function to generate new access token and store in res.locals
    const generateNewAccessToken = (userData) => {
      const newAccessToken = jwt.sign(
        { id: userData.id, program: userData.program },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: "5y" }
      );

      // Set it as cookie (for web clients)
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };

      res.cookie("accessToken", newAccessToken, cookieOptions);

      // ✅ Pass token to controller via res.locals
      res.locals.newAccessToken = newAccessToken;

      return newAccessToken;
    };

    // ✅ CASE 1: No access token
    if (!accessToken) {
      if (!refreshToken) {
        return res.status(401).json({
          message: "Unauthorized: No tokens provided",
          success: false,
        });
      }

      // Try to generate access token from refresh
      try {
        const refreshData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
        const newToken = generateNewAccessToken(refreshData);

        req.user = refreshData;
        return next();
      } catch (err) {
        return res.status(401).json({
          message: "Invalid or expired refresh token",
          success: false,
        });
      }
    }

    // ✅ CASE 2: Access token is present
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
      req.user = decoded;
      return next();
    } catch (accessError) {
      // Access token expired — try refreshing
      if (accessError.name === "TokenExpiredError" && refreshToken) {
        try {
          const refreshData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
          const newToken = generateNewAccessToken(refreshData);

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
        message: "Unauthorized: Invalid access token",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error in JWT middleware:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = { verifyjwt };
