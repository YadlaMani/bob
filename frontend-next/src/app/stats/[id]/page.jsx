"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import axios from "axios";
import { toast } from "sonner";
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
  Activity,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  DialogClose,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
const QuestStatsPage = () => {
  const [stats, setStats] = useState(null);
  const [quest, setQuest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const params = useParams();
  const questId = params.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBounty, setNewBounty] = useState("");
  const wallet = useWallet();
  const { connection } = useConnection();

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
      console.log(err);
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
      console.log(err);
    }
  }
  async function updateBounty() {
    try {
      const lamports = Number.parseFloat(newBounty) * LAMPORTS_PER_SOL;
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: process.env.NEXT_PUBLIC_MASTER_WALLET,
          lamports,
        })
      );

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "processed");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quest/addBounty/${questId}`,
        { newBounty },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setIsModalOpen(false);
      setNewBounty("");
      toast.success("Bounty added successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      toast.error("You must login first");
      router.push("/login");
    }
    if (questId) {
      getStats();
      getQuest();
    }
  }, [questId, getStats, getQuest]); // Added getQuest to dependencies

  const generatePDFReport = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text(quest.title, 14, 15);

    // Add description
    doc.setFontSize(12);
    doc.text(quest.description, 14, 25, { maxWidth: 180 });

    // Add key metrics
    doc.setFontSize(14);
    doc.text("Key Metrics", 14, 45);

    const keyMetrics = [
      ["Total Participants", uniqueParticipants.toString()],
      ["Participation Rate", `${participationRate.toFixed(1)}%`],
      ["Completion Rate", `${completionRate.toFixed(1)}%`],
      ["Avg. Time per Question", `${averageTimePerQuestion}s`],
      ["Bounty", quest.bounty.toString()],
    ];

    doc.autoTable({
      startY: 50,
      head: [["Metric", "Value"]],
      body: keyMetrics,
    });

    // Add question statistics
    doc.setFontSize(14);
    doc.text("Question Statistics", 14, doc.lastAutoTable.finalY + 10);

    stats.questionStats.forEach((question, index) => {
      const questionText = quest.questions[index].questionText;
      doc.setFontSize(12);
      doc.text(
        `Q${index + 1}: ${questionText}`,
        14,
        doc.lastAutoTable.finalY + 20
      );

      const optionData = question.optionStats.map((option, optionIndex) => [
        quest.questions[index].options[optionIndex],
        `${((option.selectedCount / stats.answeredCount) * 100).toFixed(1)}%`,
        option.selectedCount.toString(),
      ]);

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 25,
        head: [["Option", "Percentage", "Count"]],
        body: optionData,
      });
    });

    // Add quest information
    doc.setFontSize(14);
    doc.text("Quest Information", 14, doc.lastAutoTable.finalY + 10);

    const questInfo = [
      ["Created By", quest.createdBy.username],
      ["Created At", new Date(quest.createdAt).toLocaleDateString()],
      ["Status", quest.status],
      ["Total Questions", quest.questions.length.toString()],
      ["Total Attempts", quest.attempts.toString()],
    ];

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Field", "Value"]],
      body: questInfo,
    });

    // Save the PDF
    doc.save(`quest-stats-${questId}.pdf`);
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
  const averageTimePerQuestion = 120; // This should be calculated from actual data
  const uniqueParticipants = new Set(stats.answeredBy).size;
  const participationRate =
    (uniqueParticipants / (quest.attempts + stats.answeredCount)) * 100;

  const filteredQuestions = stats.questionStats.filter((question) => {
    if (filter === "all") return true;
    const highestPercentage = Math.max(
      ...question.optionStats.map(
        (o) => (o.selectedCount / stats.answeredCount) * 100
      )
    );
    if (filter === "high") return highestPercentage >= 70;
    if (filter === "medium")
      return highestPercentage >= 40 && highestPercentage < 70;
    if (filter === "low") return highestPercentage < 40;
  });

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
        <Button onClick={generatePDFReport} className="flex items-center gap-2">
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
            <div className="text-2xl font-bold">
              {completionRate.toFixed(1)}%
            </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Bounty</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quest?.bounty}</div>
              <p className="text-xs text-muted-foreground">
                Current bounty amount
              </p>
              <Button onClick={() => setIsModalOpen(true)} className="mt-2">
                Update Bounty
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bounty Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Bounty</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="bounty">New Bounty Amount</Label>
              <Input
                id="bounty"
                type="number"
                value={newBounty}
                onChange={(e) => setNewBounty(e.target.value)}
                placeholder="Enter new bounty amount"
              />
            </div>
            <DialogFooter>
              <Button onClick={() => setIsModalOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={updateBounty}>Add Bounty</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Question Stats */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Question Statistics</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter questions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Questions</SelectItem>
                  <SelectItem value="high">High Consensus (≥70%)</SelectItem>
                  <SelectItem value="medium">
                    Medium Consensus (40-69%)
                  </SelectItem>
                  <SelectItem value="low">Low Consensus (&lt;40%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription>
            Detailed breakdown of each question's performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredQuestions.map((question, index) => (
              <div key={index} className="border-t pt-4">
                <h3 className="font-semibold mb-2">
                  Question {index + 1}: {quest.questions[index].questionText}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {question.optionStats.map((option, optionIndex) => {
                    const optionText =
                      quest.questions[index].options[optionIndex];
                    const isImage = optionText.startsWith("https");

                    return (
                      <div key={optionIndex} className="flex flex-col">
                        {isImage ? (
                          <img
                            src={optionText}
                            alt={`Option ${optionIndex}`}
                            className="w-20 h-20 object-cover mb-1 rounded"
                          />
                        ) : (
                          <span className="text-sm mb-1">{optionText}</span>
                        )}

                        <div className="flex items-center gap-2">
                          <Progress
                            value={
                              (option.selectedCount / stats.answeredCount) * 100
                            }
                            className="flex-grow"
                          />
                          <span className="text-sm font-medium w-12 text-right">
                            {(
                              (option.selectedCount / stats.answeredCount) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-2 text-sm text-muted-foreground">
                  Total responses: {stats.answeredCount}
                </div>
              </div>
            ))}
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
