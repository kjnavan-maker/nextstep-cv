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

/* PUBLIC: Customer order submit */
router.post("/", upload.single("cvFile"), async (req, res) => {
  try {
    const { fullName, email, whatsapp, position, packageName, notes } = req.body;

    const trackingId =
      "NSCV-" +
      Date.now().toString().slice(-6) +
      "-" +
      Math.random().toString(36).substring(2, 6).toUpperCase();

    const newOrder = new Order({
      trackingId,
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
Tracking ID: ${trackingId}
Package: ${packageName}
Job Position: ${position}
Payment Status: Pending
Order Status: Pending

Our CV expert will contact you shortly on WhatsApp.

Best regards,
NextStep CV Team`
      );

      await sendEmail(
        process.env.EMAIL_USER,
        "New CV Order Received - NextStep CV",
        `New CV order received.

Tracking ID: ${trackingId}

Customer Details:
Name: ${fullName}
Email: ${email}
WhatsApp: ${whatsapp}
Package: ${packageName}
Job Position: ${position}
Notes: ${notes || "No notes"}

Please check the admin dashboard.`
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

/* PUBLIC: Customer order tracking */
router.post("/track", async (req, res) => {
  try {
    const { email, whatsapp } = req.body;

    const orders = await Order.find({
      email,
      whatsapp,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Tracking failed",
      error: error.message,
    });
  }
});

/* PROTECTED: Admin only - get all orders */
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

/* PROTECTED: Admin only - upload final CV */
router.put(
  "/:id/upload-final-cv",
  protect,
  upload.single("finalCvFile"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No final CV file uploaded",
        });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          finalCvFile: req.file.filename,
          orderStatus: "Delivered",
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Final CV uploaded successfully",
        order: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Upload failed",
        error: error.message,
      });
    }
  }
);

/* PROTECTED: Admin only - update status */
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

/* PROTECTED: Admin only - edit full order */
router.put("/:id", protect, async (req, res) => {
  try {
    const {
      fullName,
      email,
      whatsapp,
      position,
      packageName,
      notes,
      paymentStatus,
      orderStatus,
    } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        email,
        whatsapp,
        position,
        packageName,
        notes,
        paymentStatus,
        orderStatus,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
});

/* PROTECTED: Admin only - delete order */
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