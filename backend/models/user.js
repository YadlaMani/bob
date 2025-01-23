import { Schema, mongoose } from "mongoose";
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  earnings:{type:Number,default:0},
  balance:{type:Number,default:0},
});
const userModel = mongoose.model("User", UserSchema);
export default userModel;
