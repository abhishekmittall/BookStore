import express from 'express';
import { BookList } from "../models/booklist.js";
import { authenticate } from "../middleware/authMiddleware.js";

export const bookRouter = new express.Router();

bookRouter.use(authenticate);

// ✅ POST /api/store
bookRouter.post("/api/store", async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.summary = 'Add a new book'
  // #swagger.security = [{ bearerAuth: [] }]
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
  try {
    const getBookLists = await BookList.find({ userId: req.user.id }).populate("categoryId", "name");
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
  try {
    const getBookDetail = await BookList.findOne({ _id: req.params.id, userId: req.user.id }).populate("categoryId", "name");
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
  try {
    const deleteData = await BookList.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleteData) return res.status(404).send({ message: 'Book not found or not owned by user' });
    res.send(deleteData);
  } catch (error) {
    res.status(500).send(error);
  }
});




// ✅ GET /api/store (with Sorting & Searching)
// bookRouter.get("/api/store", async (req, res) => {
//   // #swagger.tags = ['Books']
//   // #swagger.summary = 'Retrieve all books with optional search and sort'
//   // #swagger.security = [{ bearerAuth: [] }]
//   // #swagger.parameters['search'] = { in: 'query', type: 'string', description: 'Search by bookName or author' }
//   // #swagger.parameters['sortBy'] = { in: 'query', type: 'string', description: 'Sort by field (e.g. bookName, createdAt)' }
//   // #swagger.parameters['order'] = { in: 'query', type: 'string', enum: ['asc', 'desc'], description: 'Sort order' }
//   // #swagger.responses[200] = { description: 'Filtered and sorted list of books' }

//   try {
//     const { search, sortBy = 'createdAt', order = 'desc' } = req.query;

//     const query = {
//       userId: req.user.id,
//     };

//     if (search) {
//       query.$or = [
//         { bookName: { $regex: search, $options: 'i' } },
//         { author: { $regex: search, $options: 'i' } },
//       ];
//     }

//     const sortOrder = order === 'asc' ? 1 : -1;

//     const getBookLists = await BookList.find(query)
//       .populate("categoryId", "name")
//       .sort({ [sortBy]: sortOrder });

//     res.status(200).send(getBookLists);
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });
