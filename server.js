require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const invoicesRoutes = require ("./routes/invoice")
const app = express();
const port = 3000;
require("./db/db");

// middlewares

const allowedOrigins = [
  "https://invoisify.vercel.app", // Production URL
  "http://localhost:5173"        // Local development URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // If origin is not allowed
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());
// Static folder for uploaded images
app.use("/uploads", express.static("uploads"));

// Routes

app.get("/", (req, res) => {
  res.status(200).send("Backend is running successfully.");
});

app.use(authRoutes);
app.use(invoicesRoutes);

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
