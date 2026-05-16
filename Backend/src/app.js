const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const app = express();
const path = require("path");


const journalRoutes = require( "./routes/journal.routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

app.set(
  "views",
  path.join(__dirname, "views")
);

app.use("/api/auth", authRoutes);

app.use("/api/journal", journalRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

module.exports = app;