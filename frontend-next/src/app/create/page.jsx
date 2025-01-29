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
  const [isLoading,setLoading] = useState(true);

  useEffect(() => {
    if (!wallet.publicKey) {
      toast.error("Connect wallet to create a quest");
    }
  }, [wallet.publicKey]);

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
      setOptions((prev) => {
        const newOptions = [...prev];
        newOptions[index] = uploadedUrl; // Save the image URL in options array
        return newOptions;
      });
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("File upload failed!");
    }
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (options.length === 0) {
      setError("Question must have at least one option");
      return;
    }
    const newQuestion = { questionText, type, options: [...options] };
    setQuestions((prev) => [...prev, newQuestion]);
    setQuestionText(""); // Reset the question text after adding it.
    setOptions([]); // Reset the options after adding the question.
    setError(""); // Clear any previous error.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);

    if (!title) {
      setError("Title is required");
      return;
    }
    if (!description) {
      setError("Description is required");
      return;
    }
    if (!bounty || isNaN(parseFloat(bounty))) {
      setError("Bounty is required and should be a valid number");
      return;
    }
    if (questions.length === 0) {
      setError("At least one question is required");
      return;
    }

    const questData = {
      title,
      description,
      bounty,
      status,
      questions,
      attempts,
    };

    try {
      const lamports = parseFloat(bounty) * LAMPORTS_PER_SOL;
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
    }finally{
      setLoading(true);
    }
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <Card className="w-[800px] mx-auto my-6 p-4">
      <CardHeader>
        <CardTitle>Create a Quest</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                            src={option}
                            alt={`Option ${idx + 1}`}
                            className="w-32 h-32 object-cover"
                          />
                        )}
                      </li>
                    ))}
                  </ul>
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => router.push("/")}>
              Cancel
            </Button>
            {
              isLoading? (
                <Button type="submit">Create Quest</Button>
              ) : (
                
                <Button  disabled>
                  Creating Quest...
                </Button>
              )
            }
           
          </div>
        </form>
      </CardContent>

      {/* Modal for Adding Question */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-[600px] shadow-lg">
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

              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  {type === "text" ? (
                    <Input
                      type="text"
                      value={option}
                      placeholder={`Option ${index + 1}`}
                      onChange={(e) => handleOptionChange(e, index)}
                    />
                  ) : (
                    <div>
        {/* This will render the image if the option is a URL */}
        {option && option.startsWith('http') ? (
          <img
            src={option}
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

              <Button type="button" onClick={handleAddOption} className="mt-2">
                + Add Option
              </Button>

              <div className="mt-4 flex justify-between">
                <Button variant="outline" onClick={closeModal}>
                  Close
                </Button>
                <Button type="button" onClick={handleAddQuestion}>
                  Add Question
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
