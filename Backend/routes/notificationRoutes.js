import express from "express";
import { verifyToken } from "../middleware/auth.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// GET all notifications for the logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications." });
  }
});

// MARK a notification as read
router.put("/:id/read", verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Ensure user owns the notification
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Failed to mark as read." });
  }
});

export default router;
