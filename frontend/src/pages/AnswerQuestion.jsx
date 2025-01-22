import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
const AnswerQuestion = () => {
  const [quest, setQuest] = useState(null);
  const [answers, setAnswers] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  async function getQuest() {
    try {
      const response = await axios.get(
        `http://localhost:5555/api/v1/quests/${id}`,
      );
      setQuest(response.data);
    } catch (err) {
      console.error("Error fetching the quest:", err);
    }
  }

  useEffect(() => {
    getQuest();
  }, [id]);

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionIndex,
    }));
  };

  
  const handleSubmit = async () => {
    const payload = Object.entries(answers).map(([questionId, option]) => ({
      questionId,
      option:option+1,//option changed to option+1
    }));
    try {
      const response = await axios.post(
        `http://localhost:5555/api/v1/questStats/${id}/answers`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(response.data.message);
      navigate("/");
    } catch (err) {
      toast.error("Failed to submit answers");
    }
  };

  return (
    <div>
      {quest ? (
        <div>
          <h1>Title: {quest.title}</h1>
          <p>Description: {quest.description}</p>
          <h3>Bounty: {quest.bounty}</h3>
          <h4>Status: {quest.status}</h4>
          <h5>Created At: {new Date(quest.createdAt).toLocaleString()}</h5>
          <h5>Created By: {quest.createdBy.username}</h5>

          <h2>Questions:</h2>
          <ul>
            {quest.questions.map((q, index) => (
              <li key={q._id}>
                <p>
                  Question {index + 1}: {q.questionText}
                </p>
                <ul>
                  {q.options.map((option, idx) => (            
                    <li key={idx}>                
                      <label>
                        <input
                          type="radio"
                          name={`question-${q._id}`}
                          value={idx}
                          checked={answers[q._id] === idx}
                          onChange={() => handleOptionChange(q._id, idx)}
                        />
                        {option.startsWith("https://")?<img src={option} className="h-[100px] w-[200px]"/>:option}
                      </label>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <button onClick={handleSubmit} className="border-2 px-4 py-2 rounded-full bg-blue-200">Submit Answers</button>
        </div>
      ) : (
        <p>Loading quest details...</p>
      )}
    </div>
  );
};

export default AnswerQuestion;
