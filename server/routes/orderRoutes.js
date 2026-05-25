import express from "express";
import multer from "multer";
import Order from "../models/Order.js";
import protect from "../middleware/authMiddleware.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("cvFile"), async (req, res) => {
  try {
    const { fullName, email, whatsapp, position, packageName, notes } = req.body;

    const newOrder = new Order({
      fullName,
      email,
      whatsapp,
      position,
      packageName,
      notes,
      cvFile: req.file ? req.file.filename : "",
    });

    await newOrder.save();

    try {
      await sendEmail(
        email,
        "NextStep CV - Order Received",
        `Hello ${fullName},

Thank you for placing your CV order with NextStep CV.

Order Details:
Package: ${packageName}
Job Position: ${position}
Payment Status: Pending
Order Status: Pending

Our CV expert will contact you shortly on WhatsApp.

Best regards,
NextStep CV Team`
      );
    } catch (emailError) {
      console.log("Email failed, but order saved:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Order submitted successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log("Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

router.put("/:id/status", protect, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus,
        paymentStatus,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
});

export default router;