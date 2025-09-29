const { pool } = require("../database/conn.database");
const { default: axios } = require("axios");

const addreminder = async (req, res) => {
  try {
    const { category, date, message, name, priority, subject, time } = req.body;
    console.log(category, date, message, name, priority, subject, time);
    const user_id = req.user.id;

    const sql =
      "INSERT INTO `reminders`( `userid`, `category`, `date`, `message`, `name`, `priority`, `subject`, `time`) VALUES (?,?,?,?,?,?,?,?)";
    const [result] = await pool.query(sql, [
      user_id,
      category,
      date,
      message,
      name,
      priority,
      subject,
      time,
    ]);
    return res.json({
      success: true,
      message: "Reminder Added Successfully",
    });
  } catch (error) {
    console.log("error in adding reminder", error);
    res.json({
      success: false,
      message: "Error in Adding reminder",
    });
  }
};

const getreminder = async (req, res) => {
    try {
        const user_id = req.user.id;
        
        const sql = "SELECT * FROM `reminders` WHERE `userid` = ? ORDER BY `date` ASC, `time` ASC";
        const [result] = await pool.query(sql, [user_id]);
        
        return res.json({
            success: true,
            message: "Reminders Retrieved Successfully",
            data: result
        });
        
    } catch (error) {
        console.log("error in getting reminders", error);
        res.json({
            success: false,
            message: "Error in Getting reminders",
            data: []
        });
    }
}



const deletereminder = async (req, res) => {
    try {
        const user_id = req.user.id;
        const reminder_id = req.params.id; // Get reminder ID from URL parameter
        
        // First check if the reminder exists and belongs to the user
        const checkSql = "SELECT * FROM `reminders` WHERE `id` = ? AND `userid` = ?";
        const [checkResult] = await pool.query(checkSql, [reminder_id, user_id]);
        
        if (checkResult.length === 0) {
            return res.json({
                success: false,
                message: "Reminder not found or you don't have permission to delete it"
            });
        }
        
        // Delete the reminder
        const deleteSql = "DELETE FROM `reminders` WHERE `id` = ? AND `userid` = ?";
        const [result] = await pool.query(deleteSql, [reminder_id, user_id]);
        
        return res.json({
            success: true,
            message: "Reminder Deleted Successfully"
        });
        
    } catch (error) {
        console.log("error in deleting reminder", error);
        res.json({
            success: false,
            message: "Error in Deleting reminder"
        });
    }
}


const getnotifyreminder = async (req, res) => {
    try {
        // Get current date and time in Asia/Karachi timezone
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Karachi",
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        const parts = formatter.formatToParts(now);
        
        // Format current date and time
        const currentDate = `${parts.find(p => p.type === 'year').value}-${parts.find(p => p.type === 'month').value}-${parts.find(p => p.type === 'day').value}`;
        const currentTime = `${parts.find(p => p.type === 'hour').value}:${parts.find(p => p.type === 'minute').value}`;

        // Get reminders that match current date and time
        const sql = `
            SELECT r.*, n.token 
            FROM reminders r
            INNER JOIN notification n ON r.userid = n.userid
            WHERE r.date = ?
        `;

        const [reminders] = await pool.query(sql, [currentDate]);
        console.log("Current reminders:", reminders);

        const notificationsSent = [];

        // Send notifications for matching reminders
        for (const reminder of reminders) {
            // Convert 12-hour format to 24-hour format for comparison
            const reminderTime = new Date(`2000-01-01 ${reminder.time}`).toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });

            // Compare times (allowing for 1-minute difference)
            const currentMinutes = parseInt(currentTime.split(':')[0]) * 60 + parseInt(currentTime.split(':')[1]);
            const reminderMinutes = parseInt(reminderTime.split(':')[0]) * 60 + parseInt(reminderTime.split(':')[1]);
            
            if (Math.abs(currentMinutes - reminderMinutes) <= 1) {
                if (reminder.token) {
                  console.log(reminder.token);
                  
                    try {
                        await axios.post(
                            "https://exp.host/--/api/v2/push/send",
                            {
                                to: reminder.token,
                                title: reminder.subject,
                                body: reminder.message,
                                sound: "default",
                                priority: "high",
                                data: {
                                    priority: reminder.priority,
                                    category: reminder.category
                                }
                            },
                            {
                                headers: {
                                    Accept: "application/json",
                                    "Accept-Encoding": "gzip, deflate",
                                    "Content-Type": "application/json",
                                },
                            }
                        );
                        notificationsSent.push(reminder.id);
                    } catch (error) {
                        console.log(`Failed to send notification for reminder ${reminder.id}:`, error);
                    }
                }
            }
        }

        return res.json({
            success: true,
            message: `Notifications sent for ${notificationsSent.length} reminders`,
            notificationsSent: notificationsSent
        });

    } catch (error) {
        console.log("Error in reminder notifications:", error);
        return res.json({
            success: false,
            message: "Error processing reminder notifications"
        });
    }
}

// Update the module exports
module.exports = {
    addreminder,
    getreminder,
    deletereminder,
    getnotifyreminder
};
