const jwt = require('jsonwebtoken');
const { pool } = require("../database/conn.database.js");
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

const deleteaccont=async(req,res)=>{
       try {
    const userId = req.user.id;
 const result = await pool.query('DELETE FROM user WHERE user_id = ?', [userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, message: 'Account deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}


module.exports = {
  authCheck,
  deleteaccont,
    checkToken: authCheck
};


