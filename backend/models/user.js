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
});

const userModel = mongoose.model("User", UserSchema);
export default userModel;
