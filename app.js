import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import sequelize from "./config/sequelize.js";
import { initializeSocket } from "./socket/index.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import packageRoutes from "./routes/package.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import placeActivityRoutes from "./routes/placeActivity.routes.js";
import hotelRoutes from "./routes/hotel.routes.js";
import placeRoutes from "./routes/place.routes.js";
import hotelTypeRoutes from "./routes/hotelType.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import messageRoutes from "./routes/message.routes.js";
import customPackageRoutes from "./routes/customizePackage.routes.js";
import customizePackagePlaceRoutes from "./routes/customizePackagePlace.routes.js";
import seedRoutes from "./routes/seed.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server

// Initialize Socket.IO with the HTTP server
initializeSocket(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/place-activities", placeActivityRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/hotel-types", hotelTypeRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/chats", messageRoutes);
app.use("/api/custom-packages", customPackageRoutes);
app.use("/api/custom-package-places", customizePackagePlaceRoutes);
app.use("/api/seeds", seedRoutes);

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
