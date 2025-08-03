import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/sequelize.js";
import authRoutes from "./routes/auth.route.js";
import categoryRoutes from "./routes/category.route.js";
import packageRoutes from "./routes/package.route.js";
import tourTypeRoutes from "./routes/tourType.route.js";
import activityRoutes from "./routes/activity.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/tour-types", tourTypeRoutes);
app.use("/api/activities", activityRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3000;

try {
  await sequelize.authenticate();
  console.log("✅ Sequelize connected to DB successfully");
} catch (error) {
  console.error(error);
  console.error("❌ Sequelize failed to connect:", error.message);
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
