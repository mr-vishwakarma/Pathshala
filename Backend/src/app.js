const express = require("express");
const cors = require("cors");
const app = express();
const authRoute = require("./routes/auth.routes")


app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

module.exports = app;