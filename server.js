const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const prescriptionRoutes = require("./routes/prescriptions.js");
const errorMiddleware = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();
const PORT = process.env.PRESCRIPTION_PORT;

app.use(helmet()); // Setting Security headers

let limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 10 minutes
  max: 100, // limit 100 requests per 10 minutes
  message: "Too many requests from this IP, please try again later."
});

app.use(limiter);
app.use(morgan('dev')); // Morgan Logging
app.use(express.json()); // Body parser
app.use(errorMiddleware); // Centralized error handler

app.use(prescriptionRoutes);

app.listen(PORT, () => {
  console.log(`Prescription Service running on port ${PORT}`);
});
