import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const auth = new express.Router();

// Register
auth.post("/api/register", async (req, res) => {
    // #swagger.tags = ['Auth']
    // #swagger.summary = 'Register a new user'
    // #swagger.requestBody = {
    //   required: true,
    //   content: {
    //     "application/json": {
    //       schema: {
    //         type: "object",
    //         required: ["name", "email", "password"],
    //         properties: {
    //           name: { type: "string", example: "Abhishek Mittal" },
    //           email: { type: "string", example: "user@example.com" },
    //           password: { type: "string", example: "123456" }
    //         }
    //       }
    //     }
    //   }
    // }
    // #swagger.responses[201] = { description: "User registered successfully" }
    // #swagger.responses[400] = { description: "Validation error or duplicate email" }
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
    // #swagger.requestBody = {
    //   required: true,
    //   content: {
    //     "application/json": {
    //       schema: {
    //         type: "object",
    //         required: ["email", "password"],
    //         properties: {
    //           email: { type: "string", example: "user@example.com" },
    //           password: { type: "string", example: "123456" }
    //         }
    //       }
    //     }
    //   }
    // }
    // #swagger.responses[200] = { description: 'Login successful, token returned' }
    // #swagger.responses[400] = { description: 'Invalid email or password' }

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