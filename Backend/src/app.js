const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const app = express();
app.set("trust proxy", 1);
const path = require("path");
const errorMiddleware = require("./middleware/error.middleware");

const journalRoutes = require("./routes/journal.routes");

const dashboardRoutes = require("./routes/dashboard.routes");
const profileRoutes = require("./routes/profile.routes");

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      // In development, allow any local origin (localhost or 127.0.0.1 on any port)
      if (process.env.NODE_ENV !== "production") {
        if (
          origin.startsWith("http://localhost:") ||
          origin.startsWith("http://127.0.0.1:") ||
          origin === "http://localhost" ||
          origin === "http://127.0.0.1"
        ) {
          return callback(null, true);
        }
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/dashboard", dashboardRoutes);

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use("/api/auth", authRoutes);

app.use("/api/journal", journalRoutes);
app.use("/api/profile", profileRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(errorMiddleware);
app.get("/", (req, res) => {
  res.send("Backend Running");
});

module.exports = app;
