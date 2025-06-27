import express from 'express';
import { BookList } from "../models/booklist.js";
import { authenticate } from "../middleware/authMiddleware.js";

export const bookRouter = new express.Router();

bookRouter.use(authenticate); // Protect all book routes

// ✅ POST /api/store
bookRouter.post("/api/store", async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.summary = 'Add a new book'
  // #swagger.security = [{ bearerAuth: [] }]
  // #swagger.requestBody = {
  //   required: true,
  //   content: {
  //     "application/json": {
  //       schema: {
  //         type: "object",
  //         required: ["bookName", "descriptions", "author", "language"],
  //         properties: {
  //           bookName: { type: "string" },
  //           descriptions: { type: "string" },
  //           author: { type: "string" },
  //           language: { type: "string" }
  //         }
  //       }
  //     }
  //   }
  // }

  try {
    const addBook = new BookList({ ...req.body, userId: req.user.id });
    const insertData = await addBook.save();
    res.status(201).send(insertData);
  } catch (error) {
    res.status(400).send(error);
  }
});

// ✅ GET /api/store
bookRouter.get("/api/store", async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.summary = 'Retrieve all books'
  // #swagger.security = [{ bearerAuth: [] }]
  // #swagger.responses[200] = { description: 'List of all books' }
  try {
    const getBookLists = await BookList.find({ userId: req.user.id });
    res.status(200).send(getBookLists);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ✅ GET /api/store/:id
bookRouter.get("/api/store/:id", async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.summary = 'Get a book by ID'
  // #swagger.security = [{ bearerAuth: [] }]
  // #swagger.parameters['id'] = { description: 'Book ID', type: 'string' }
  // #swagger.responses[200] = { description: 'Book found' }
  try {
    const getBookDetail = await BookList.findOne({ _id: req.params.id, userId: req.user.id });
    if (!getBookDetail) return res.status(404).send({ message: 'Book not found' });
    res.status(200).send(getBookDetail);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ✅ PATCH /api/store/:id
bookRouter.patch("/api/store/:id", async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.summary = 'Update a book'
  // #swagger.security = [{ bearerAuth: [] }]
  // #swagger.parameters['id'] = { description: 'Book ID', type: 'string' }
  // #swagger.requestBody = {
  //   content: {
  //     "application/json": {
  //       schema: {
  //         type: "object",
  //         properties: {
  //           bookName: { type: "string" },
  //           descriptions: { type: "string" },
  //           author: { type: "string" },
  //           language: { type: "string" }
  //         }
  //       }
  //     }
  //   }
  // }
  // #swagger.responses[200] = { description: 'Book updated' }
  try {
    const bookListUpdate = await BookList.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!bookListUpdate) return res.status(404).send({ message: 'Book not found or not owned by user' });
    res.status(200).send(bookListUpdate);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ✅ DELETE /api/store/:id
bookRouter.delete("/api/store/:id", async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.summary = 'Delete a book'
  // #swagger.security = [{ bearerAuth: [] }]
  // #swagger.parameters['id'] = { description: 'Book ID', type: 'string' }
  // #swagger.responses[200] = { description: 'Book deleted successfully' }
  try {
    const deleteData = await BookList.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleteData) return res.status(404).send({ message: 'Book not found or not owned by user' });
    res.send(deleteData);
  } catch (error) {
    res.status(500).send(error);
  }
});