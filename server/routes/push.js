const e = require("express");
const express = require("express");
const webPush = require("web-push");
const router = express.Router();

webPush.setVapidDetails(
  "mailto:your@email.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

let subscriptions = [];

router.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

router.post("/send", async (req, res) => {
  const { title, body, url } = req.body;

  const payload = JSON.stringify({ title, body, url });

  for (const sub of subscriptions) {
    try {
      await webPush.sendNotification(sub, payload);
    } catch (err) {
      console.log(err);
    }
  }
  res.status(200).json({ message: "Push Send" });
});

module.exports = router;
