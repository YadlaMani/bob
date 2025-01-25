import { Schema, mongoose } from "mongoose";

const OptionStatsSchema = new Schema({
  option: { type: Number, required: true },
  selectedCount: { type: Number, default: 0 },
});

const QuestionStatsSchema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    ref: "Quest.questions",
    required: true,
  },
  optionStats: [OptionStatsSchema],
});

const QuestStatsSchema = new Schema({
  questId: { type: Schema.Types.ObjectId, ref: "Quest", required: true },
  answeredCount: { type: Number, default: 0 },
  answeredBy: [{ type: String }],
  questionStats: [QuestionStatsSchema],
});

const questStatsModel = mongoose.model("QuestStats", QuestStatsSchema);
export default questStatsModel;
