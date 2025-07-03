import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const auth = new express.Router();

// REGISTER
auth.post("/api/register", async (req, res) => {
    // #swagger.tags = ['Auth']
    // #swagger.summary = 'Register a new user'

    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).send({ message: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();

        res.status(201).send({ message: "User registered successfully", user: savedUser });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Login
auth.post("/api/login", async (req, res) => {
    // #swagger.tags = ['Auth']
    // #swagger.summary = 'Login user and get token'

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send({ message: "Invalid email or password" });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "yourSuperSecretKeyHere", { expiresIn: "1h" });
        res.send({ token });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

auth.post("/api/forgot-password", async (req, res) => {
    // #swagger.tags = ['Auth']
    // #swagger.summary = 'Generate a reset token for password reset'

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(200).send({ message: "If this email exists, a reset token will be generated." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "yourSuperSecretKeyHere", { expiresIn: "15m" });

    // Simulate sending email by returning token in response
    res.send({
        message: "Use this token to reset your password",
        resetToken: token,
        exampleResetEndpoint: "/api/reset-password",
    });
});

auth.post("/api/reset-password", async (req, res) => {
    // #swagger.tags = ['Auth']
    // #swagger.summary = 'Reset password using token'

    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "yourSuperSecretKeyHere");
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

        res.send({ message: "Password has been reset successfully." });
    } catch (err) {
        res.status(400).send({ message: "Invalid or expired token." });
    }
});