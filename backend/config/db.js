import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected",()=>{
        console.log("DB connected");
    })
    mongoose.connection.on("error", (err) => {
      console.log("DB Error",err);
    });
    mongoose.connection.on("disconnected", () => {
      console.log("DB disconnected");
    });

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.error("Error during Connecting DB", err);
  }
};


export default connectDB;