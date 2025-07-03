import express from 'express';
import { Category } from '../models/category.js';
import { authenticate } from '../middleware/authMiddleware.js';

export const categoryRoutes = new express.Router();

categoryRoutes.use(authenticate);

// ✅ Create Category
categoryRoutes.post('/api/categories', async (req, res) => {
    // #swagger.tags = ['Categories']
    // #swagger.summary = 'Create a new book category'
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).send(category);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// ✅ Get All Categories
categoryRoutes.get('/api/categories', async (req, res) => {
    // #swagger.tags = ['Categories']
    // #swagger.summary = 'Get all categories'
    try {
        const categories = await Category.find();
        res.send(categories);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// ✅ Get Category by ID
categoryRoutes.get('/api/categories/:id', async (req, res) => {
    // #swagger.tags = ['Categories']
    // #swagger.summary = 'Get category by ID'
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).send({ message: 'Category not found' });
        res.send(category);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// ✅ Update Category
categoryRoutes.patch('/api/categories/:id', async (req, res) => {
    // #swagger.tags = ['Categories']
    // #swagger.summary = 'Update category'
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) return res.status(404).send({ message: 'Category not found' });
        res.send(category);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// ✅ Delete Category
categoryRoutes.delete('/api/categories/:id', async (req, res) => {
    // #swagger.tags = ['Categories']
    // #swagger.summary = 'Delete category'
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).send({ message: 'Category not found' });
        res.send({ message: 'Category deleted', category });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});