"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import { toast } from "sonner";

export default function CreateQuestion() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const router = useRouter();

  const [type, setType] = useState("text");
  const [addQuestion, setAddQuestion] = useState(false);
  const [options, setOptions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [bounty, setBounty] = useState();
  const [status, setStatus] = useState("open");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");

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
        newOptions[index] = uploadedUrl;
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
    setQuestionText("");
    setOptions([]);
    setAddQuestion(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !bounty || questions.length === 0) {
      setError("All fields are required");
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
    }
  };

  return (
    <div className="p-6 flex flex-col space-y-3">
      <InputField
        label="Title of Quest"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <InputField
        label="Description of Quest"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex flex-col border-2 border-black p-3">
        <div className="flex justify-between px-2">
          <h1 className="text-3xl font-semibold">Create Questions</h1>
          <button className="border-2 p-2" onClick={() => setAddQuestion(true)}>
            Add a Question
          </button>
        </div>
        {questions.map((question, index) => (
          <div key={index} className="p-3 border-b">
            <h3 className="text-xl font-bold">{question.questionText}</h3>
            <ul className="list-disc ml-5">
              {question.options.map((option, idx) => (
                <li key={idx}>
                  {question.type === "text" ? (
                    option
                  ) : (
                    <img src={option} alt={`Option ${idx + 1}`} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {addQuestion && (
          <form onSubmit={handleAddQuestion} className="mt-4">
            <InputField
              label="Question Text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
            <SelectField
              label="Option Type"
              options={[
                { value: "text", label: "Text" },
                { value: "image", label: "Image" },
              ]}
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                {type === "text" ? (
                  <input
                    type="text"
                    value={option}
                    placeholder={`Option ${index + 1}`}
                    onChange={(e) => handleOptionChange(e, index)}
                    className="border p-1"
                  />
                ) : (
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, index)}
                    className="border p-1"
                  />
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddOption}
              className="mt-2 px-4 py-2 border"
            >
              + Add Option
            </button>
            <button
              type="submit"
              className="mt-4 px-4 py-2 border bg-blue-500 text-white"
            >
              Add Question
            </button>
          </form>
        )}
      </div>
      <InputField
        label="Bounty"
        type="number"
        value={bounty}
        onChange={(e) => setBounty(e.target.value)}
      />
      <InputField
        label="Attempts"
        type="number"
        value={attempts}
        onChange={(e) => setAttempts(e.target.value)}
      />
      <SelectField
        label="Status"
        options={[
          { value: "open", label: "Open" },
          { value: "closed", label: "Closed" },
          { value: "draft", label: "Draft" },
        ]}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 border bg-green-500 text-white"
      >
        Create Quest
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

function InputField({ label, ...props }) {
  return (
    <label className="flex flex-col">
      {label}:
      <input className="border p-2 mt-1" {...props} />
    </label>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <label className="flex flex-col">
      {label}:
      <select className="border p-2 mt-1" {...props}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
