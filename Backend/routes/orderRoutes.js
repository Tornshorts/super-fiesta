import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Item from "../models/Item.js";
import Notification from "../models/Notification.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// CREATE A NEW ORDER
router.post("/", verifyToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { shopId, items: orderedItems } = req.body; // Expects items as [{ itemId: "...", quantity: 2 }]
    const customerId = req.user.id;

    if (!shopId || !orderedItems || orderedItems.length === 0) {
      return res.status(400).json({ message: "Missing shop or item data." });
    }

    let totalAmount = 0;
    const itemsForOrder = [];

    // Validate items and decrement stock
    for (const orderedItem of orderedItems) {
      const item = await Item.findById(orderedItem.itemId).session(session);
      if (!item) {
        throw new Error(`Item with ID ${orderedItem.itemId} not found.`);
      }
      if (item.stock < orderedItem.quantity) {
        throw new Error(
          `Not enough stock for ${item.name}. Available: ${item.stock}, Requested: ${orderedItem.quantity}`
        );
      }

      item.stock -= orderedItem.quantity;
      await item.save({ session });

      totalAmount += item.price * orderedItem.quantity;
      itemsForOrder.push({
        item: item._id,
        name: item.name,
        price: item.price,
        quantity: orderedItem.quantity,
      });
    }

    // Create and save the new order
    const newOrder = new Order({
      customer: customerId,
      shop: shopId,
      items: itemsForOrder,
      totalAmount,
    });
    await newOrder.save({ session });

    await session.commitTransaction();
    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
});

// GET ORDERS FOR A CUSTOMER
router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate("shop", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
});

// GET ORDERS FOR A SHOP OWNER
router.get("/shop/:shopId", verifyToken, async (req, res) => {
  try {
    // Add a check here to ensure req.user.id is the owner of the shop
    const orders = await Order.find({ shop: req.params.shopId })
      .populate("customer", "email") // or name, etc.
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch shop orders." });
  }
});

// UPDATE ORDER STATUS
router.put("/:orderId/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("shop");
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Security check: Ensure the user owns the shop this order belongs to
    if (order.shop.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this shop." });
    }

    order.status = status;
    await order.save();

    // Create a notification for the customer
    await new Notification({
      user: order.customer,
      message: `Your order #${order._id
        .toString()
        .substring(0, 8)} is now ${status}.`,
      orderId: order._id,
    }).save();

    res.json({ message: "Order status updated.", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status." });
  }
});

// CANCEL AN ORDER (CUSTOMER)
router.put("/:orderId/cancel", verifyToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).session(session);

    if (!order) {
      throw new Error("Order not found.");
    }

    // Security check: Ensure the user owns the order
    if (order.customer.toString() !== req.user.id) {
      throw new Error("Forbidden: You do not own this order.");
    }

    // Check if the order is cancellable
    if (order.status !== "pending") {
      throw new Error(
        `Only pending orders can be cancelled. Status is: ${order.status}`
      );
    }

    // Restore stock for each item in the order
    for (const orderedItem of order.items) {
      await Item.findByIdAndUpdate(
        orderedItem.item,
        { $inc: { stock: orderedItem.quantity } },
        { session }
      );
    }

    // Update order status to 'cancelled'
    order.status = "cancelled";
    await order.save({ session });

    await session.commitTransaction();
    res.json({ message: "Order cancelled successfully.", order });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
});

export default router;
