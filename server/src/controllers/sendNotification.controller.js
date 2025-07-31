const { default: axios } = require("axios");
const { pool } = require("../database/conn.database");

const storetokens = async (req, res) => {
  try {
    const userid = req.user.id;
    const { token } = req.body;
    console.log(token);

    const sql = "SELECT * FROM notification WHERE userid=?";
    const [searchresult] = await pool.query(sql, [userid]);

    if (searchresult.length > 0) {
      if (searchresult[0].token !== token) {
        const updateSql = "UPDATE notification SET token=? WHERE userid=?";
        const [updatetoken] = await pool.query(updateSql, [token, userid]);
        if (updatetoken.affectedRows > 0) {
          console.log("Token updated");
          return res.status(200).json({ message: "Token updated" });
        }
      } else {
        return res.status(200).json({ message: "Token already up to date" });
      }
    } else {
      const insertSql =
        "INSERT INTO notification (userid, token) VALUES (?, ?)";
      const [result] = await pool.query(insertSql, [userid, token]);
      console.log(result);
      if (result) {
        const response = await axios.post(
          "https://exp.host/--/api/v2/push/send",
          {
            to: token,
            title: "Welcome",
            body: "Welcome To timetablr",
            sound: "default",
            priority: "high",
          },
          {
            headers: {
              Accept: "application/json",
              "Accept-Encoding": "gzip, deflate",
              "Content-Type": "application/json",
            },
          }
        );

        return res
          .status(201)
          .json({ message: "Token stored", res: response.data });
      }
    }
  } catch (error) {
    console.log("error in storing token", error);
    return res.status(500).json({ error: error });
  }
};

const sendnotification = async (req, res) => {
  try {
    const sql = "select * from notification";
    const [responcetoken] = await pool.query(sql);
    console.log(responcetoken);
    const uniqueTokens = [
      ...new Set(responcetoken.map((row) => row.token).filter(Boolean)),
    ];

    if (responcetoken.length > 0) {
      const chunks = chunkArray(uniqueTokens, 100);

      for (const tokenchunk of chunks) {
        const response = await axios.post(
          "https://exp.host/--/api/v2/push/send",
          tokenchunk.map((token) => ({
            to: token,
            title: "Class Notification",
            body: "Your Class Is about to Start",
            sound: "default",
            priority: "high",
          })),
          {
            headers: {
              Accept: "application/json",
              "Accept-Encoding": "gzip, deflate",
              "Content-Type": "application/json",
            },
          }
        );
      }
    }
    return res.json("mesage sent");
  } catch (error) {
    console.log("error in sedning notification", error);
  }
};

function chunkArray(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

const displayNotification = async (req, res) => {
  try {
    const sql = `SELECT * from notification
     INNER JOIN user ON notification.userid=user.user_id`;
    const [responce] = await pool.query(sql);
    console.log(responce);

    return res.json({
      success: true,
      data: responce,
    });
  } catch (error) {
    console.log("error in displaying notification", error);
  }
};

const classNotification = async (req, res) => {
  try {
    const now = new Date();

    // Format current day and time in Asia/Karachi timezone
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Karachi",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(now);

    const dayName = parts.find((part) => part.type === "weekday").value;
    const hour = parseInt(parts.find((p) => p.type === "hour").value);
    const minute = parseInt(parts.find((p) => p.type === "minute").value);
    const second = parseInt(parts.find((p) => p.type === "second").value);
    const currentTotalMinutes = hour * 60 + minute;
    const formattedTime = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}:${second.toString().padStart(2, "0")}`;

    // Fetch today's classes
    const sql = `
      SELECT 
        programs.program_name AS program_name,
        timetable.start_time,
        timetable.day,
        timetable.course_name
      FROM timetable
      INNER JOIN programs ON programs.program_id = timetable.program_name
      WHERE timetable.day = ?
    `;
    const [response] = await pool.query(sql, [dayName]);

    // Filter classes that start in exactly 10 minutes
    const notificationClasses = response.filter((row) => {
      const [startHourStr, startMinuteStr] = row.start_time.split(":");
      const startHour = parseInt(startHourStr, 10);
      const startMinute = parseInt(startMinuteStr, 10);
      const startTotalMinutes = startHour * 60 + startMinute;

      const diff = startTotalMinutes - currentTotalMinutes;
      return diff === 10;
    });

    const results = [];

    const getuser = `
      SELECT user.user_id, user.username, notification.token
      FROM user 
      INNER JOIN notification ON user.user_id = notification.userid 
      WHERE user.program = ?
    `;

    for (const row of notificationClasses) {
      const [users] = await pool.query(getuser, [row.program_name]);

      const notifiedUsers = [];

      for (const user of users) {
        try {
          const sendrespoce = await axios.post(
            "https://exp.host/--/api/v2/push/send",
            {
              to: user.token,
              title: "Class Notification",
              body: `Your ${row.course_name} class is about to start in 10 mins`,
              sound: "default",
              priority: "high",
            },
            {
              headers: {
                Accept: "application/json",
                "Accept-Encoding": "gzip, deflate",
                "Content-Type": "application/json",
              },
            }
          );

          notifiedUsers.push({
            user_id: user.user_id,
            name: user.name,
            token: user.token,
            pushStatus: sendrespoce.status,
            pushResponse: sendrespoce.data,
          });
        } catch (pushError) {
          notifiedUsers.push({
            user_id: user.user_id,
            name: user.name,
            token: user.token,
            pushStatus: "error",
            pushError: pushError.message,
          });
        }
      }

      results.push({
        classInfo: {
          program_name: row.program_name,
          course_name: row.course_name,
          start_time: row.start_time,
          day: row.day,
        },
        notifiedUsers,
      });
    }

    return res.json({
      day: dayName,
      time: formattedTime,
      notifications: results,
    });
  } catch (error) {
    console.log("error in sending notification", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const sendcustomMsg = async (req, res) => {
  try {
    const { token, msg } = req.body;

    if (!token || !msg) {
      return res.status(400).json({
        success: false,
        message: "Token and message are required"
      });
    }

    const response = await axios.post(
      "https://exp.host/--/api/v2/push/send",
      {
        to: token,
        title: "TimeTablr",
        body: msg,
        sound: "default",
        priority: "high",
      },
      {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return res.json({
        message: "Notification sent",
        success: true
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send notification",
        response: response.data
      });
    }
  } catch (error) {
    console.log("Error in sending notification:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to send notification",
      error: error.message || "Unknown error"
    });
  }
};
module.exports = {
  storetokens,
  sendnotification,
  displayNotification,
  classNotification,
  sendcustomMsg
};
