import { Schema, mongoose } from "mongoose";

const EarningsHistorySchema = new Schema({
  time: { type: Date, required: true },
  amount: { type: Number, required: true },
});

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  earnings: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  earningsHistory: [EarningsHistorySchema],
  percentage: { type: Number, default: 100 },
  quest: [{ type: Schema.Types.ObjectId, ref: "Quest" }],
  joinAs: {
    type: String,
    enum: ["both", "organization", "contributor"],
    default: "both",
  },
  ageGroup: {
    type: String,
    enum: ["18-24", "25-34", "35-44", "45-54", "55+"],
    default: "18-24",
  },
  country: {
    type: String,
    default: "IN",
  },
  tags: [{ type: String }],
});

const userModel = mongoose.model("User", UserSchema);
export default userModel;
