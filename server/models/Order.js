import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    whatsapp: String,
    position: String,
    packageName: String,
    notes: String,
    cvFile: String,
    finalCvFile: String,
    paymentStatus: {
      type: String,
      default: "Pending",
    },
    orderStatus: {
      type: String,
      default: "Pending",
    },
    trackingId: {
    type: String,
    unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);