import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const email = "admin@nextstepcv.com";
    const password = "admin123";

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();

      console.log("Admin password reset successfully");
      process.exit();
    }

    await Admin.create({
      name: "NextStep CV Admin",
      email,
      password: hashedPassword,
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

createAdmin();