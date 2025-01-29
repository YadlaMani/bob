import { Schema, mongoose } from "mongoose";

const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  options: [{ type: String }],
});
const QuestSchema = new Schema({
  thumbnail: {
    type: String,
    required: true,
    default:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.V5zfZZhnF2epZ7FnbejUxwHaEo%26pid%3DApi&f=1&ipt=fc04d043469e13d2f7d0d6485b5cf9ebaf9769301e67a16f76b8f7ad71000f7e&ipo=images",
  },
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
