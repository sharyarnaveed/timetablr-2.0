import { app } from "./src/app.js";
import { pool } from "./src/database/conn.database.js";



pool.connect()
  .then(() => {
    console.log("database connected");

    app.listen(process.env.PORT || 8000, () => {
      console.log("server is running at ", `${process.env.PORT}`);
    })

  }).catch((err) => {

    console.log(err, "database not connected");
  });
