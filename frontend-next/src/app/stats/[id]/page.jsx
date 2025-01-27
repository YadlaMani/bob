"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Users,
  Trophy,
  Clock,
  BarChart2,
  Activity,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import html2pdf from "html2pdf.js";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

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

  const downloadPDF = () => {
    const element = document.getElementById("stats-content");
    const opt = {
      margin: 1,
      filename: `quest-stats-${questId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  if (!stats || !quest)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">No stats available</p>
      </div>
    );

  const completionRate =
    (stats.answeredCount / (quest.attempts + stats.answeredCount)) * 100 || 0;
  const averageTimePerQuestion = 120; // This would come from backend
  const uniqueParticipants = new Set(stats.answeredBy).size;
  const participationRate =
    (uniqueParticipants / (quest.attempts + stats.answeredCount)) * 100;

  return (
    <div
      id="stats-content"
      className="container mx-auto p-6 space-y-6 animate-fade-in mt-8"
    >
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{quest.title}</h1>
          <p className="text-muted-foreground mt-2">{quest.description}</p>
        </div>
        <Button onClick={downloadPDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Participants
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueParticipants}</div>
            <p className="text-xs text-muted-foreground">
              {participationRate.toFixed(1)}% participation rate
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Time per Question
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageTimePerQuestion}s</div>
            <p className="text-xs text-muted-foreground">
              Average completion time
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bounty</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quest.bounty}</div>
            <p className="text-xs text-muted-foreground">
              Current bounty amount
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Question Response Distribution */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Option Selection Distribution</CardTitle>
          <CardDescription>
            Breakdown of selected options per question
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.questionStats.map((stat, index) => ({
                  name: `Q${index + 1}`,
                  ...stat.optionStats.reduce(
                    (acc, curr) => ({
                      ...acc,
                      [`Option ${curr.option}`]: curr.selectedCount,
                    }),
                    {}
                  ),
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                {stats.questionStats[0]?.optionStats.map((_, index) => (
                  <Bar
                    key={`option-${index}`}
                    dataKey={`Option ${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quest Meta Information */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Quest Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created By</span>
                <span className="font-medium">{quest.createdBy.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created At</span>
                <span className="font-medium">
                  {new Date(quest.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium flex items-center gap-2">
                  {quest.status === "open" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  {quest.status}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Questions</span>
                <span className="font-medium">{quest.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Attempts</span>
                <span className="font-medium">{quest.attempts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completion Rate</span>
                <span className="font-medium">
                  {completionRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestStatsPage;
