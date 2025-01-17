import questStatsModel from "../models/questStat.js";

const updateQuestStats = async (questId, username, answers) => {
  const questStats = await questStatsModel.findOne({ questId });
  console.log(questStats);

  if (!questStats) {
    throw new Error("Quest stats not found");
  }

  if (!questStats.answeredBy.includes(username)) {
    questStats.answeredBy.push(username);
    questStats.answeredCount += 1;
  }

  const answersArray = answers.answers;

  answersArray.forEach((answer) => {
    const questionStat = questStats.questionStats.find(
      (qs) => qs.questionId.toString() === answer.questionId
    );

    if (questionStat) {
      const optionStat = questionStat.optionStats.find(
        (os) => os.option === answer.option
      );

      if (optionStat) {
        optionStat.selectedCount += 1;
      } else {
        console.error(
          `Option ${answer.option} not found for question ${answer.questionId}`
        );
      }
    } else {
      console.error(`Question ${answer.questionId} not found in quest stats`);
    }
  });

  await questStats.save();
  console.log("QuestStats updated successfully");
};

export default updateQuestStats;
