"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { areas } from "@/consts/tags";
import { Badge, X } from "lucide-react";

export default function CreateQuestion() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const router = useRouter();

  const [type, setType] = useState("text");
  const [options, setOptions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [bounty, setBounty] = useState();
  const [status, setStatus] = useState("open");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [thumbnail, setThumbnail] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      toast.error("You must login first");
      router.push("/login");
    }
  }, []);

  const handleAddOption = () => setOptions((prev) => [...prev, ""]);

  const handleOptionChange = (e, index) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;
    setOptions(newOptions);
  };

  const handleFileUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const uploadedUrl = response.data;
      if (index != -1) {
        setOptions((prev) => {
          const newOptions = [...prev];
          newOptions[index] = uploadedUrl; // Save the image URL in options array
          return newOptions;
        });
      } else {
        setThumbnail(uploadedUrl);
      }
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("File upload failed!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);
    if (!thumbnail) {
      setError("Thumbnail is required");
      return;
    }

    if (!title) {
      setError("Title is required");
      return;
    }
    if (!description) {
      setError("Description is required");
      return;
    }
    if (!bounty || isNaN(Number.parseFloat(bounty))) {
      setError("Bounty is required and should be a valid number");
      return;
    }
    if (questions.length === 0) {
      setError("At least one question is required");
      return;
    }

    const questData = {
      thumbnail,
      title,
      description,
      bounty,
      status,
      questions,
      attempts,
      selectedTags,
    };

    try {
      const lamports = Number.parseFloat(bounty) * LAMPORTS_PER_SOL;
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: process.env.NEXT_PUBLIC_MASTER_WALLET,
          lamports,
        })
      );

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "processed");
      toast.success("Bounty set successfully!");

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quests/create`,
        questData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Quest created successfully!");
      router.push("/");
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
      toast.error("Failed to create quest");
    } finally {
      setLoading(true);
    }
  };
  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
    toast.success("Question removed successfully!");
  };
  const handleEditQuestion = (index) => {
    setEditingIndex(index);
    setQuestionText(questions[index].questionText);
    setOptions([...questions[index].options]);
    setType(questions[index].type);
    openModal();
  };

  const handleAddOrUpdateQuestion = (e) => {
    e.preventDefault();

    if (options.length === 0) {
      setError("Question must have at least one option");
      return;
    }

    const updatedQuestion = { questionText, type, options: [...options] };

    if (editingIndex !== null) {
      // Update existing question
      setQuestions((prev) =>
        prev.map((q, i) => (i === editingIndex ? updatedQuestion : q))
      );
      setEditingIndex(null);
    } else {
      // Add new question
      setQuestions((prev) => [...prev, updatedQuestion]);
    }

    // Reset fields
    setQuestionText("");
    setOptions([]);
    setError("");
    closeModal();
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };
  const handleAddTag = (area) => {
    if (selectedTags.length >= 6) {
      toast.error("You cannot select more than 6 interests.");
      return;
    }
    if (!selectedTags.includes(area)) {
      setSelectedTags([...selectedTags, area]);
    }
  };
  console.log(selectedTags);

  return (
    <Card className="w-[800px] mx-auto my-6 p-4 bg-background">
      <CardHeader>
        <CardTitle>Create a Quest</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {thumbnail === null ? (
              <Input type="file" onChange={(e) => handleFileUpload(e, -1)} />
            ) : (
              <img
                src={thumbnail}
                alt="thumbnail"
                className="w-[inherit] h-32 object-cover"
              />
            )}
          </div>
          <div>
            <Label htmlFor="title">Title of Quest</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Quest title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description of Quest</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your quest"
            />
          </div>

          {/* Add Question Button */}
          <Button type="button" onClick={openModal} className="mt-4">
            Add Question
          </Button>

          {/* Accordion for Questions Created */}
          <Accordion type="multiple">
            {questions.map((question, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{question.questionText}</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc ml-5">
                    {question.options.map((option, idx) => (
                      <li key={idx}>
                        {question.type === "text" ? (
                          option
                        ) : (
                          <img
                            src={option || "/placeholder.svg"}
                            alt={`Option ${idx + 1}`}
                            className="w-32 h-32 object-cover"
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      className="bg-green-700 hover:bg-green-400"
                      onClick={() => handleEditQuestion(index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-pen"
                      >
                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                      </svg>
                    </Button>

                    <Button
                      type="button"
                      className="bg-red-700 hover:bg-red-400"
                      onClick={() => handleRemoveQuestion(index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-trash-2"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div>
            <Label htmlFor="bounty">Bounty (in SOL)</Label>
            <Input
              id="bounty"
              type="number"
              value={bounty}
              onChange={(e) => setBounty(e.target.value)}
              placeholder="Enter bounty"
            />
          </div>

          <div>
            <Label htmlFor="attempts">Max Attempts</Label>
            <Input
              id="attempts"
              type="number"
              value={attempts}
              onChange={(e) => setAttempts(e.target.value)}
              placeholder="Max number of attempts"
            />
          </div>
          <div>
            {/* Interest Selection */}
            <div className="space-y-2">
              <label htmlFor="areas">Select Domains (Max 6)</label>
              <Select onValueChange={handleAddTag}>
                <SelectTrigger id="areas">
                  <SelectValue placeholder="Choose an interest" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="space-x-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    variant="secondary"
                    className="text-sm py-1 px-2 w-[fit-content] bg-gray-700 rounded-lg "
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Select
            value={status}
            onValueChange={(newValue) => setStatus(newValue)}
            className="w-full mt-4"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => router.push("/")}>
              Cancel
            </Button>
            {isLoading ? (
              <Button type="submit">Create Quest</Button>
            ) : (
              <Button disabled>Creating Quest...</Button>
            )}
          </div>
        </form>
      </CardContent>

      {/* Modal for Adding Question */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-scroll no-scrollbar">
          <div className="bg-background rounded-lg p-8 w-[90%] max-w-[600px] shadow-lg max-h-[90vh] overflow-y-scroll no-scrollbar">
            <h3 className="text-xl font-semibold mb-4">Add a Question</h3>
            <div className="space-y-4">
              <Label htmlFor="questionText">Question Text</Label>
              <Input
                id="questionText"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter question"
              />

              <Select
                value={type}
                onValueChange={(newType) => setType(newType)}
                className="mt-2"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>

              <div className="max-h-[300px] overflow-y-scroll no-scrollbar space-y-2 p-2 border rounded-md bg-background">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {type === "text" ? (
                      <Input
                        type="text"
                        value={option}
                        placeholder={`Option ${index + 1}`}
                        onChange={(e) => handleOptionChange(e, index)}
                      />
                    ) : (
                      <div>
                        {option && option.startsWith("http") ? (
                          <img
                            src={option || "/placeholder.svg"}
                            alt={`Option ${index + 1}`}
                            className="w-32 h-32 object-cover border rounded"
                          />
                        ) : (
                          <Input
                            type="file"
                            onChange={(e) => handleFileUpload(e, index)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button type="button" onClick={handleAddOption} className="mt-2">
                + Add Option
              </Button>

              <div className="mt-4 flex justify-between">
                <Button variant="outline" onClick={closeModal}>
                  Close
                </Button>
                <Button type="button" onClick={handleAddOrUpdateQuestion}>
                  {editingIndex !== null ? "Update Question" : "Add Question"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
