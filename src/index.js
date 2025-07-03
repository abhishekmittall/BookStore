import express from "express";
import cors from "cors";
import connectDB from "./db/conn.js";
import { auth } from "./routers/authRoutes.js";
import { bookRouter } from "./routers/bookRoutes.js";
import { profileRoutes } from "./routers/profileRoutes.js";
import { categoryRoutes } from "./routers/categoryRoutes.js";

import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerDocument = require("./swagger-output.json");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var options = {
  customCss: '.swagger-ui .topbar { display: none }'
};

app.use('/api/schema/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.use(auth);
app.use(categoryRoutes);
app.use(bookRouter);
app.use(profileRoutes);

// Connect DB first, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});