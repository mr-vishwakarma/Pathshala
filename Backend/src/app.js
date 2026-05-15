const dotenv = require("dotenv")
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth.routes");


app.use(cors());
app.use(express.json());
app.use("cookieParser")

app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Backend Running");
});



module.exports = app;