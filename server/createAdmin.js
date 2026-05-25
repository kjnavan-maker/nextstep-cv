import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    const hashedPassword = await bcrypt.hash(
      "admin123",
      10
    );

    const admin = await Admin.create({
      name: "NextStep Admin",
      email: "admin@nextstepcv.com",
      password: hashedPassword,
    });

    console.log("Admin Created:");
    console.log(admin);

    process.exit();
  })
  .catch((err) => {
    console.log(err);
  });