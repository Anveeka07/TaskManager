const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);
app.use(express.json({ limit: "1mb" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((error) => console.log("❌ MongoDB error:", error.message));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Something went wrong" });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error(`Run: lsof -nP -iTCP:${PORT} -sTCP:LISTEN`);
    console.error("Then stop that process and restart backend.");
    process.exit(1);
  }

  console.error("❌ Server startup failed:", err.message);
  process.exit(1);
});
