import mongoose from "mongoose";

// Connection MongoDB
const DB = process.env.MONGO_URL || "mongodb+srv://bookstore:storeadmin@cluster0.rmtofin.mongodb.net/bookdata?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Failed:", err.message);
    process.exit(1); // stop the server if DB fails
  }
};

export default connectDB;