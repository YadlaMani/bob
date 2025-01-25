import { Schema, mongoose } from "mongoose";

const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  options: [{ type: String }],
});
const QuestSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [QuestionSchema],
  bounty: { type: Number, required: true, min: 0 },
  attempts: { type: Number, required: true, min: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["open", "closed", "draft"],
  },
});
const questModel = mongoose.model("Quest", QuestSchema);
export default questModel;
