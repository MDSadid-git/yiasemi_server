import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionDB = await mongoose.connect(
      `${process.env.MONGODB_URN}/${DB_NAME}`
    );
    console.log(
      `MONGODB connected successfully ${connectionDB.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB CONNECTION Failed", error);
    process.exit(1);
  }
};

export default connectDB;
