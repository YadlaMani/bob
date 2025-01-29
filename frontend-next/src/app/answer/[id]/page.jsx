"use client";
import React, { useState, useEffect } from "react";
import {
  Timer,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Trophy,
  ArrowLeft,
  Brain,
  Clock,
  Award,
} from "lucide-react";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

function App() {
  const [quest, setQuest] = useState(null);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(20 * 60);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [bountyEarned, setBountyEarned] = useState(0);
  const wallet = useWallet();
  const params = useParams();
  const id = params.id;
  // console.log();

  useEffect(() => {
    async function fetchQuest() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quests/${id}`
        );
        setQuest(response.data);
      } catch (error) {
        toast.error("Error fetching quest data. Please try again.");
      }
    }

    fetchQuest();
  }, [id]);

  useEffect(() => {
    if (isTestStarted && !isTestCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            toast.error("Time's up! Test ended.");
            setIsTestCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isTestStarted, isTestCompleted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [quest.questions[currentQuestionIndex]._id]: selectedAnswer,
      }));

      if (currentQuestionIndex < quest.questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedAnswer(null);
      } else {
        setIsTestCompleted(true);
      }
    } else {
      toast.error("Please select an answer before proceeding.");
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer before submitting.");
      return;
    }

    const updatedAnswers = {
      ...answers,
      [quest.questions[currentQuestionIndex]._id]: selectedAnswer,
    };

    try {
      const payload = Object.entries(updatedAnswers).map(([questionId, option]) => ({
        questionId,
        option: option + 1,
      }));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/questStats/${id}/answers`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setBountyEarned(response.data.bountyEarned || 0);
      setAnswers(updatedAnswers);
      setIsTestCompleted(true);
      toast.success("Test submitted successfully!");
    } catch (error) {
      console.error("Error submitting test:", error.response?.data || error.message);
      toast.error("Error submitting test. Please try again.");
    }
  };

  const handleReturnHome = () => {
    setIsTestStarted(false);
    setIsTestCompleted(false);
    setCurrentQuestionIndex(0);
    setTimeRemaining(20 * 60);
    setSelectedAnswer(null);
    setAnswers({});
    setBountyEarned(0);
  };
  
  if (isTestCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 mt-4">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-10">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Congratulations!
            </h1>
            <p className="text-gray-600 text-lg">You've successfully completed the quest</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-8 border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Bounty Earned</h2>
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              {(quest.bounty * 0.95) / quest.attempts} USDC
            </p>
          </div>

          <button
            onClick={handleReturnHome}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
            <ArrowLeft className="w-5 h-5" />
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isTestStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            {quest?.title}
          </h1>
          <p className="text-gray-600 text-center text-lg mb-8">{quest?.description}</p>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Time Limit</p>
              <p className="text-lg font-semibold text-blue-700">20 Minutes</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-6 text-center">
              <Award className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Questions</p>
              <p className="text-lg font-semibold text-indigo-700">{quest?.questions?.length || 0}</p>
            </div>
          </div>

          <button
            onClick={() => setIsTestStarted(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
            Begin Quest
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quest?.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quest?.questions.length) * 100;

  console.log("current question",currentQuestion);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-6 ">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 rounded-full shadow-md">
                <span className="text-white font-semibold">
                  Question {currentQuestionIndex + 1}/{quest.questions.length}
                </span>
              </div>
              <div className="w-48 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full shadow-md">
              <Timer className="w-5 h-5 text-amber-600" />
              <span className="text-amber-700 font-semibold">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {currentQuestion?.questionText}
            </h2>
            <ul className="space-y-4">
              {currentQuestion?.options.map((option, index) => (
                <li key={index}>
                  <label className="flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:shadow-md"
                    style={{
                      borderColor: selectedAnswer === index ? '#3b82f6' : '#e5e7eb',
                      backgroundColor: selectedAnswer === index ? '#eff6ff' : 'white'
                    }}>
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={index}
                      checked={selectedAnswer === index}
                      onChange={() => setSelectedAnswer(index)}
                      className="w-5 h-5 text-blue-600"
                    />
                    {option.startsWith("https://") ? (
                      <img
                        src={option}
                        alt={`Option ${index + 1}`}
                        className="w-48 h-32 object-cover rounded-lg shadow-md"
                      />
                    ) : (
                      <span className="text-gray-700 text-lg">{option}</span>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={
                currentQuestionIndex === quest?.questions.length - 1
                  ? handleSubmit
                  : handleNext
              }
              className={`px-8 py-4 rounded-xl text-white font-semibold transition-all duration-300 flex items-center gap-2 ${
                selectedAnswer !== null
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={selectedAnswer === null}>
              <span>
                {currentQuestionIndex === quest?.questions.length - 1
                  ? "Submit Quiz"
                  : "Next Question"}
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;