//external packages
import express from "express";
import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { z } from "zod";
import jwt from "jsonwebtoken";
import cors from "cors";

//internal packages
import userModel from "./models/user.js";
import questModel from "./models/quest.js";
import questStatsModel from "./models/questStat.js";
import { forumModel, commentModel } from "./models/forum.js";
//middleware
import verifyToken from "./middleware/verifyToken.js";
//utilities
import initializeQuestStats from "./utils/initializeQuestStats.js";
import updateQuestStats from "./utils/updateQuestStats.js";
import multer from "multer";
import uploadToS3 from "./utils/AWSUpload.js";
import sendBalanceToUser from "./utils/sendBalanceToUser.js";
import { AddressLookupTableProgram } from "@solana/web3.js";

const upload = multer({ storage: multer.memoryStorage() });
//general setup
const app = express();
app.use(express.json());
app.listen("5555", () => {
  console.log("Server is running on port 5555");
});
app.use(cors());

// Handle Preflight Requests

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/your-database")
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
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
    res.status(200).json({
      message: "Registration successful continue with onboarding",
      token: token,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err);
  }
});
app.post("/api/v1/login", async (req, res) => {
  console.log(req.body);
  const { emailOrUsername, password, type } = req.body;

  if (type === "email") {
    const email = emailOrUsername;
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
    const username = emailOrUsername;
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

//upload file
app.post("/api/v1/upload", upload.single("file"), async (req, res) => {
  console.log(req.file);

  const fileUrl = await uploadToS3(req.file);

  return res.status(200).json(fileUrl);
});

//quest routes
app.post("/api/v1/quests/create", verifyToken, async (req, res) => {
  let { thumbnail, title, description, questions, bounty, status, attempts } =
    req.body;
  console.log(req.body);

  const createdBy = req.user.username;
  const user = await userModel.findOne({ username: createdBy });
  if (!user) {
    res.status(400).json({ message: "User not found" });
  }
  const quest = new questModel({
    thumbnail,
    title,
    description,
    questions,
    bounty,
    createdBy: user,
    status,
    attempts,
  });
  const createdQuest = await quest.save();
  console.log("Created quest", createdQuest);
  await initializeQuestStats(createdQuest._id);

  res.status(200).json({ message: "Quest created successfully" });
});
app.get("/api/v1/quests", async (req, res) => {
  const quests = await questModel
    .find({ status: "open" })
    .populate("createdBy", "username");
  res.status(200).json(quests);
});
app.get("/api/v1/quests/:id", async (req, res) => {
  const questId = req.params.id;
  const quest = await questModel
    .findById(questId)
    .populate("createdBy", "username");
  if (quest) {
    res.status(200).json(quest);
  } else {
    res.status(404).json({ message: "Quest not found" });
  }
});
app.post("/api/v1/quest/addBounty/:id", verifyToken, async (req, res) => {
  const questId = req.params.id;
  console.log(req.body);
  const newBounty = req.body.newBounty;
  const quest = await questModel.findById(questId);
  if (!quest) {
    res.status(404).json({ message: "Quest not found" });
  }
  quest.bounty += Number.parseFloat(newBounty);
  await quest.save();
  res.status(200).json({ message: "Bounty added successfully" });
});
//questStats
app.post(
  "/api/v1/questStats/:questId/answers",
  verifyToken,
  async (req, res) => {
    const { questId } = req.params;
    const username = req.user.username;
    const answers = req.body;

    try {
      // Update quest stats
      await updateQuestStats(questId, username, answers);

      // Fetch the quest and user documents
      const quest = await questModel.findById(questId);
      if (!quest) {
        return res.status(404).json({ message: "Quest not found" });
      }

      const user = await userModel.findOne({ username: username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log(user);
      user.quest.push(quest);

      // Update user earnings and balance
      const reward = (quest.bounty * 0.95) / quest.attempts;

      user.balance += reward;
      user.earnings += reward;
      quest.bounty -= reward;
      user.earningsHistory.push({ amount: reward, time: new Date() });

      // Update quest attempts
      quest.attempts -= 1;
      if (quest.attempts == 0) {
        quest.status = "closed";
      }
      // Save the updated documents
      await user.save();
      await quest.save();

      res
        .status(200)
        .json({ message: "Answers submitted successfully", earnings: reward });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to submit answers", error: error.message });
    }
  }
);

app.get("/api/v1/questStats/:questId", verifyToken, async (req, res) => {
  try {
    const questStats = await questStatsModel.findOne({
      questId: req.params.questId,
    });
    res.status(200).json(questStats);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Failed to fetch quest stats" });
  }
});
//user routes
app.get("/api/v1/user", verifyToken, async (req, res) => {
  const username = req.user.username;
  const users = await userModel.find({ username }).populate("quest");
  res.status(200).json(users);
});
app.get("/api/v1/user/quests", verifyToken, async (req, res) => {
  const username = req.user.username;
  const user = await userModel.findOne({ username });
  const quests = await questModel.find({ createdBy: user._id });
  res.status(200).json(quests);
});
app.post("/api/v1/user/withdraw", verifyToken, async (req, res) => {
  try {
    const username = req.user.username;
    // const username = "test";
    const toAddress = req.body.pubKey;
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const balance = user.balance;
    if (balance <= 0) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    const transactionSignature = await sendBalanceToUser(balance, toAddress);
    user.balance = 0;
    await user.save();
    res.status(200).json({
      message: `Balance of ${balance} SOL deposited successfully`,
      transactionSignature,
    });
  } catch (error) {
    console.error("Withdrawal API error:", error);
    res
      .status(500)
      .json({ message: "Withdrawal failed", error: error.message });
  }
});
app.post("/api/v1/user/onboarding", async (req, res) => {
  const username = req.body.username;
  console.log(req.body);
  try {
    const user = await userModel.findOne({
      username,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { joinAs, ageGroup, country, tags } = req.body;
    user.joinAs = joinAs;
    user.ageGroup = ageGroup;
    user.country = country;
    user.tags = tags;
    await user.save();
    res.status(200).json({ message: "Onboarding successful" });
  } catch (err) {
    console.log(err.message);
  }
});
app.get("/api/v1/users", async (req, res) => {
  try {
    const users = await userModel
      .find({}, "username earnings quest earningsHistory")
      .sort({ earnings: -1 });

    const formattedUsers = users.map((user) => ({
      username: user.username,
      earnings: user.earnings,
      questCount: user.earningsHistory.length,
      userId: user._id,
    }));

    res.status(200).json({ users: formattedUsers });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});
app.get("/api/v1/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel
      .findById(id)
      .select("username earnings earningsHistory quest country tags")
      .populate("quest");

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "Couldn't find user" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
//forum routes
app.get("/api/v1/forums", async (req, res) => {
  try {
    const forums = await forumModel.find({});
    res.status(200).json(forums);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Failed to fetch forums" });
  }
});
app.post("/api/v1/forums", verifyToken, async (req, res) => {
  try {
    const { title, description, bounty } = req.body;
    const username = req.user.username;
    const user = await userModel.findOne({ username });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    const newForum = await forumModel.create({
      userId: user._id,
      title,
      description,
      bounty,
    });
    res.status(200).json({
      message: "Forum created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Failed to create forum" });
  }
});
app.get("/api/v1/forums/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const forum = await forumModel.findById(id);
    if (forum) {
      res.status(200).json(forum);
    } else {
      res.status(404).json({ message: "Couldn't find forum" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
app.post("/api/v1/forums/:id/comments", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { content } = req.body;
    const username = req.user.username;
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!content) {
      return res.status(400).json({ message: "Content are required" });
    }

    const forum = await forumModel.findById(id);
    if (!forum) {
      return res.status(404).json({ message: "Forum not found" });
    }

    // Create a new comment
    const comment = await commentModel.create({
      userId: user._id,
      content,
      username: user.username,
    });

    forum.comments.push(comment);
    await forum.save();

    res.status(200).json({ message: "Comment added successfully", comment });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add comment" });
  }
});
