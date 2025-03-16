require("dotenv").config();
const express = require("express");
const path = require("path");
const pushRoutes = require("./routes/push");
const weatherRoutes = require("./routes/weather");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/api/vapid-key", (req, res) => {
  res.json({ vapidPublicKey: process.env.VAPID_PUBLIC_KEY });
});

app.use("/api/weather", weatherRoutes);

app.use("/api/push", pushRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` http://localhost:${PORT}`));
