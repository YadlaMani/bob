"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const QuestStatsPage = () => {
  const [stats, setStats] = useState(null);
  const [quest, setQuest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const questId = params.id;

  async function getStats() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/questStats/${questId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setStats(response.data);
    } catch (err) {
      toast.error("Failed to load stats");
    } finally {
      setIsLoading(false);
    }
  }

  async function getQuest() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quests/${questId}`
      );
      setQuest(response.data);
    } catch (err) {
      toast.error("Failed to load quest");
    }
  }

  useEffect(() => {
    if (questId) {
      getStats();
      getQuest();
    }
  }, [questId]);

  if (isLoading) return <div>Loading...</div>;
  if (!stats || !quest) return <div>No stats available</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">{quest.title}</h1>
            <p className="text-gray-600">{quest.description}</p>
            <div className="text-sm text-gray-500">
              Created by {quest.createdBy.username}
            </div>
          </div>
          <div className="text-right">
            <div>Bounty: {quest.bounty}</div>
            <div>Status: {quest.status}</div>
            <div className="text-sm text-gray-500">
              {new Date(quest.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <h2 className="font-semibold">Quest Overview</h2>
            <div>Total Questions: {quest.questions.length}</div>
            <div>Total Answered: {stats.answeredCount}</div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Question Statistics</h2>
        {stats.questionStats.map((questionStat) => (
          <div
            key={questionStat.questionId}
            className="bg-white shadow rounded-lg p-4 mb-4"
          >
            <h3 className="font-semibold mb-2">
              Question ID: {questionStat.questionId}
            </h3>
            {questionStat.optionStats.map((option) => (
              <div
                key={option._id}
                className="flex justify-between border-b py-2 last:border-b-0"
              >
                <span>Option: {option.option}</span>
                <span>Selected Count: {option.selectedCount}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestStatsPage;
