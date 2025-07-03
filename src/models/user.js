import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  profilePhoto: { type: String },
  password: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", userSchema);