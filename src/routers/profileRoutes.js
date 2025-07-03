import express from 'express';
import { User } from '../models/user.js';
import { authenticate } from '../middleware/authMiddleware.js';
import bcrypt from 'bcryptjs';

export const profileRoutes = new express.Router();

profileRoutes.use(authenticate);

// ✅ GET /api/profile
profileRoutes.get('/api/profile', async (req, res) => {
    // #swagger.tags = ['Profile']
    // #swagger.summary = 'Get the current user profile'
    // #swagger.security = [{ bearerAuth: [] }]

    const user = await User.findById(req.user.id).select('-password');
    res.send(user);
});

// ✅ PATCH /api/profile
profileRoutes.patch('/api/profile', async (req, res) => {
    // #swagger.tags = ['Profile']
    // #swagger.summary = 'Update user profile'
    // #swagger.security = [{ bearerAuth: [] }]

    const { name, password, profilePhoto } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (password) updates.password = await bcrypt.hash(password, 10);
    if (profilePhoto) updates.profilePhoto = profilePhoto;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.send(updatedUser);
});

// ✅ POST /api/change-password
profileRoutes.post('/api/change-password', async (req, res) => {
    // #swagger.tags = ['Profile']
    // #swagger.summary = 'Change current user\'s password'
    // #swagger.security = [{ bearerAuth: [] }]s

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
        return res.status(400).send({ message: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.send({ message: 'Password changed successfully' });
});