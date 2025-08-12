const jwt = require('jsonwebtoken');

const authCheck = async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ valid: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    
    if (decoded) {
      return res.json({ 
        valid: true, 
        message: 'Token is valid',
        userId: decoded.userId || decoded.id // Include user info if needed
      });
    }

  } catch (error) {
    // Token is invalid or expired
    return res.json({ 
      valid: false, 
      message: error.message === 'jwt expired' ? 'Token expired' : 'Invalid token'
    });
  }
};

module.exports = {
  authCheck,
  checkToken: authCheck // Keep both names for flexibility
};


