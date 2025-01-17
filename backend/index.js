//external packages
import express from "express";
import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { z } from "zod";
import jwt from "jsonwebtoken";
//internal packages
import userModel from "./models/user.js";
import verifyToken from "./middleware/verifyToken.js";
//general setup
const app = express();
app.use(express.json());
app.listen("5555", () => {
  console.log("Server is running on port 5555");
});
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Database connection failed:", err));

app.get("/", (req, res) => {
  res.send("API is running...");
});
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

app.post("/api/v1/signup", async (req, res) => {
  const { username, email, password } = signupSchema.parse(req.body);
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new userModel({ username, email, password: hashedPassword });
  try {
    await user.save();
    res.send("User Registered Successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});
app.post("/api/v1/login", async (req, res) => {
  const { emailorusername, password, type } = req.body;

  if (type === "email") {
    const email = emailorusername;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } else {
    console.log("From username section");
    const username = emailorusername;
    const user = await userModel.findOne({ username });
    console.log(username);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  }
});
app.get("/api/v1/protected", verifyToken, (req, res) => {
  console.log(req.user);
  res.send("protected route working");
});
