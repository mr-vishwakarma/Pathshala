const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const app = express();
const path = require("path");
const errorMiddleware = require("./middleware/error.middleware");

const journalRoutes = require("./routes/journal.routes");

const dashboardRoutes = require("./routes/dashboard.routes");
const profileRoutes = require("./routes/profile.routes");

app.use(cors());
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
