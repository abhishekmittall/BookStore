import mongoose from "mongoose";

const bookListSchema = new mongoose.Schema({
  bookName: { type: String, required: true, unique: true, trim: true },
  descriptions: { type: String, required: true },
  author: { type: String, required: true, trim: true },
  language: { type: String, required: true, trim: true },
  publishDated: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
});

export const BookList = mongoose.model("BookList", bookListSchema);