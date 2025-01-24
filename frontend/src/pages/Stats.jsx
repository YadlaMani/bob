import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function Stats() {
  const [stats, setStats] = useState();
  const [quest, setQuest] = useState();
  const { questId } = useParams();
  const [question,setQuestion]=useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [questionMap, setQuestionMap] = useState({
    question: "",
    questionId: "",
  });
  //fetching quest details
  async function fetchQuest(id) {
    try {
      const response = await axios.get(
        `http://localhost:5555/api/v1/quests/${id}`
      );
      console.log("Quest", response.data);
      setQuest(response.data);
    } catch (err) {
      toast.error("Failed to load stats");
    }
  }

  //fetching stats details
  async function getStats() {
    try {
      const response = await axios.get(
        `http://localhost:5555/api/v1/questStats/${questId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchQuest(response.data.questId);
      console.log(response.data);

      setStats(response.data);
    } catch (err) {
      toast.error("Failed to load stats");
    } finally {
      setIsLoading(false);
    }
  }

  

  useEffect(() => {
    getStats();
  }, [questId]);
  if (isLoading) return <p>loading</p>;
  const questionFilterStats=question==='all'?stats.questionStats:stats.questionStats.filter(q => q.questionId === question);
  return (
    <div>
      <h1>Stats Page</h1>
      <h2>Filters</h2>
      <label>Select Question</label>
      <select name="question" onChange={(e)=>setQuestion(e.target.value)}>
        <option value={"all"}>All</option>
        {stats &&
          stats.questionStats.map((question) => (
            <option key={question._id} value={question.questionId}>
              {question.questionId}
            </option>
          ))}
      </select>

      {quest && (
        <div>
          <div className="flex felx-row justify-between items-center p-3">
            <div className="flex flex-col">
              <h1 className="text-3xl font-semibold">{quest.title}</h1>
              <h2 className="text-sm text-gray-400">{quest.description}</h2>
              <div className="">{quest.createdBy.username}</div>
            </div>
            <div>
              <div className="">{quest.bounty}</div>
              <div className="">{quest.status}</div>
              <div className="">
                {new Date(quest.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <h2>Quest Stats</h2>
          <div>
            <div>Total Questions: {quest.questions.length}</div>
            <div>Total Answered Count: {stats.answeredCount}</div>
            {questionFilterStats.map((question) => (
              <div key={question.questionId} className="my-4">
                <h3 className="font-semibold">
                  Question ID: {question.questionId}
                </h3>
                {question.optionStats.map((option) => (
                  <div key={option._id} className="ml-4">
                    <div>Option: {option.option}</div>
                    <div>Selected Count: {option.selectedCount}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
