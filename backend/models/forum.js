import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  recievedBounty: { type: Number, default: 0 },
});

const ForumSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  bounty: { type: Number, default: 0 },
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
});

// Create the models
const forumModel = mongoose.model("Forum", ForumSchema);
const commentModel = mongoose.model("Comment", CommentSchema);

// Export the models using named exports
export { forumModel, commentModel };
