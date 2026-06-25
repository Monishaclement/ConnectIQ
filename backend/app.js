const express = require("express");

const cors = require("cors");

const authRoutes = require("./routers/auth.routes");
const recommendRoutes = require("./routers/recommend.routes");
const userRoutes = require("./routers/user.routes");
const reportRoutes = require("./routers/report.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/recommendations", recommendRoutes);
app.use("/api/users", userRoutes);
app.use("/api/report", reportRoutes);

app.get("/", (req, res) => {
  res.send("ConnectIQ Backend Running");
});

module.exports = app;