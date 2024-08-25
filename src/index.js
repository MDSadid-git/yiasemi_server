import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(
    app.listen(process.env.PORT, () => {
      console.log("Yiasemi Server is Listening on Port: ", process.env.PORT);
    })
  )
  .catch((err) => console.log(`The database connition fiald ${err}`));
