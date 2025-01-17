import questStatsModel from "../models/questStat.js";
import questModel from "../models/quest.js";

const initializeQuestStats = async (questId) => {
  const quest = await questModel.findById(questId);

  if (!quest) {
    throw new Error("Quest not found");
  }

  const questionStats = quest.questions.map((question) => ({
    questionId: question._id,
    optionStats: question.options.map((option) => ({
      option,
      selectedCount: 0,
    })),
  }));

  const questStats = new questStatsModel({
    questId: quest._id,
    questionStats,
  });

  await questStats.save();
  console.log("QuestStats initialized successfully");
};
export default initializeQuestStats;
