const { default: axios } = require("axios");
const { pool } = require("../database/conn.database");

const storetokens = async (req, res) => {
  try {
    const userid = req.user.id;
    const { token } = req.body;
    console.log(token);

    const sql = "SELECT * FROM NOTIFICATION WHERE userid=?";
    const [searchresult] = await pool.query(sql, [userid]);

    if (searchresult.length > 0 && searchresult.token != token) {
      const sql = "UPDATE notification set token= ? where userid=?";
      const [updatetoken] = await pool.query(sql, [token, userid]);
      if (updatetoken) {
        console.log("token updated");
      }
    } else {
      const sql = "INSERT INTO NOTIFICATION (USERID,TOKEN) VALUES(?,?) ";
      const [result] = await pool.query(sql, [userid, token]);
      console.log(result);
    }
  } catch (error) {
    console.log("error in stroing token", error);
  }
};


const sendnotification=async(req,res)=>
{
    try {
       
        const sql="select * from notification";
        const [responcetoken]=await pool.query(sql)
        console.log(responcetoken);
           const uniqueTokens = [...new Set(responcetoken.map(row => row.token).filter(Boolean))];
 
if (responcetoken.length>0) {
const chunks=chunkArray(uniqueTokens,100)

for(const tokenchunk of chunks )
{
const response = await axios.post('https://exp.host/--/api/v2/push/send', tokenchunk.map(token => ({
        to: token,
        title: "Class Notification",
        body: "Your Class Is about to Start",
        sound: 'default',
        priority: 'high',
      })), {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        }
      });
}

  


}
       

    } catch (error) {
        console.log("error in sedning notification",error);
        
    }

}

function chunkArray(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}


module.exports = { storetokens,sendnotification };
