"use client";
import React, { useState, useEffect } from "react";
import {
  Timer,
  ChevronRight,
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      const payload = Object.entries(updatedAnswers).map(
        ([questionId, option]) => ({
          questionId,
          option: option + 1,
        })
      );

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
      console.error(
        "Error submitting test:",
        error.response?.data || error.message
      );
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
      <div className="container mx-auto px-4 py-8 mb-2">
        <Card className="max-w-xl mx-auto">
          <CardContent className="p-10">
            <div className="mb-8 text-center">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-3">Congratulations!</h1>
              <p className="text-muted-foreground text-lg">
                You've successfully completed the quest
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-xl font-semibold">Bounty Earned</h2>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">
                  {(quest.bounty * 0.95) / quest.attempts} SOL
                </p>
              </CardContent>
            </Card>

            <Button onClick={handleReturnHome} className="w-full">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isTestStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-10">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-center mb-4">
              {quest?.title}
            </h1>
            <p className="text-muted-foreground text-center text-lg mb-8">
              {quest?.description}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Time Limit</p>
                  <p className="text-lg font-semibold">20 Minutes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="text-lg font-semibold">
                    {quest?.questions?.length || 0}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button onClick={() => setIsTestStarted(true)} className="w-full">
              Begin Quest
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = quest?.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quest?.questions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Badge variant="default">
                Question {currentQuestionIndex + 1}/{quest.questions.length}
              </Badge>
              <div className="w-48 h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              <span>{formatTime(timeRemaining)}</span>
            </Badge>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {currentQuestion?.questionText}
            </h2>
            <div className="space-y-4">
              {currentQuestion?.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto py-4 px-6"
                  onClick={() => setSelectedAnswer(index)}
                >
                  {option.startsWith("https://") ? (
                    <img
                      src={option || "/placeholder.svg"}
                      alt={`Option ${index + 1}`}
                      className="w-48 h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-lg">{option}</span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button
              onClick={
                currentQuestionIndex === quest?.questions.length - 1
                  ? handleSubmit
                  : handleNext
              }
              disabled={selectedAnswer === null}
            >
              <span>
                {currentQuestionIndex === quest?.questions.length - 1
                  ? "Submit Quiz"
                  : "Next Question"}
              </span>
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
