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
  tags:{
    type: [String],
    required: true,

    enum: [
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
  validate: {
    validator: function (tags) {
      return tags.length >= 2&&tags.length <=6;
    },
    message: "At least 2 tags are required.",
  },
  }
});
const questModel = mongoose.model("Quest", QuestSchema);
export default questModel;
