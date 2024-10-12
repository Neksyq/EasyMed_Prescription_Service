import express, { Application } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import prescriptionRoutes from "./routes/prescriptions";
import errorMiddleware from "./middleware/errorMiddleware";

dotenv.config();

const app: Application = express();
const PORT = process.env.PRESCRIPTION_PORT;

// Set security HTTP headers
app.use(helmet());

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit to 100 requests per 15 minutes
  message: "Too many requests from this IP, please try again later.",
});

// Apply rate limiter to all requests
app.use(limiter);

// HTTP request logger
app.use(morgan("dev"));

// Body parser for incoming JSON requests
app.use(express.json());

// Prescription routes
app.use("/", prescriptionRoutes);

// Centralized error handler middleware
app.use(errorMiddleware);

// Start the server
app.listen(PORT, () => {
  console.log(`Prescription Service running on port ${PORT}`);
});
