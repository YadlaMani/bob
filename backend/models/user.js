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
  tags: [{ type: String,
    enum:[
      "Technology", "Science", "Health", "Fitness", "Travel",
      "Food", "Music", "Art", "Photography", "Gaming",
      "Fashion", "Movies", "Books", "Writing", "Sports",
      "Automobiles", "Finance", "Business", "Marketing", "Real_Estate",
      "Parenting", "Education", "Self_Improvement", "Personal_Finance", "Investment",
      "Cryptocurrency", "Space", "Nature", "Wildlife", "Environment",
      "DIY", "Home_Decor", "Gardening", "Pets", "Social_Media",
      "Psychology", "Philosophy", "History", "Politics", "Spirituality",
      "Adventure", "Camping", "Hiking", "Extreme_Sports", "Cooking",
      "Dancing", "Stand_Up_Comedy", "Astrology", "Mythology", "Volunteering"
  ],
   }],
});

const userModel = mongoose.model("User", UserSchema);
export default userModel;
