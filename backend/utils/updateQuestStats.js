import questStatsModel from "../models/questStat.js";

const updateQuestStats = async (questId, username, answers) => {
  try {
    console.log("Ans",answers);
    const questStats = await questStatsModel.findOne({ questId });
    console.log("Fetched QuestStats:", questStats);

    if (!questStats) {
      throw new Error("Quest stats not found");
    }

    if (!questStats.answeredBy.includes(username)) {
      questStats.answeredBy.push(username);
      questStats.answeredCount += 1;
    }
    console.log("hello",answers);
    let i = 0;
    for (let questions in questStats.questionStats) {
      questStats.questionStats[questions].optionStats[
        answers[i].option - 1
      ].selectedCount += 1;
      i++;
    }

    await questStats.save();
    console.log("QuestStats updated successfully");
  } catch (error) {
    console.error("Error updating quest stats:", error);
    throw error;
  }
};

export default updateQuestStats;
