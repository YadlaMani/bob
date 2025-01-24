import { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { toast } from "sonner";
export default function CreateQuestion() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [type, setType] = useState("text"); // Selected question type
  const [addQuestion, setAddQuestion] = useState(false);
  const [options, setOptions] = useState([]); // Options for the current question
  const [questions, setQuestions] = useState([]); // List of added questions
  const [questionText, setQuestionText] = useState("");
  const [bounty, setBounty] = useState();
  const [status, setStatus] = useState("open");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  if (!wallet.publicKey) {
    toast.error("Connect wallet to create quest");
  }
  // Add new empty option
  const handleAddOption = () => {
    setOptions((prevOptions) => [...prevOptions, ""]); // Add empty string for new option
  };

  // Handle text option change
  const handleOptionChange = (e, index) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;
    setOptions(newOptions);
  };

  // Handle file upload for image options
  const handleFileUpload = async (e, index) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const uploadedUrl = response.data; // Assuming the API returns the URL directly in response.data
      setOptions((prevOptions) => {
        const newOptions = [...prevOptions];
        newOptions[index] = uploadedUrl; // Update the specific index
        return newOptions.length ? newOptions : [uploadedUrl]; // Ensure at least one option exists
      });
      toast.success("File uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("File upload failed!");
    }
  };

  // Add question to the list
  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (options.length == 0) {
      setError("Question must have at least one option");

      return;
    }
    const newQuestion = {
      questionText,
      type,
      options: [...options],
    };
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    setQuestionText("");
    setOptions([]);
    setAddQuestion(false);
  };

  // Submit quest
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title === "" || !bounty || questions.length === 0) {
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
          toPubkey: import.meta.env.VITE_MASTER_WALLET,
          lamports,
        })
      );
      console.log("Sending transaction...", transaction);
      const signature = await wallet.sendTransaction(transaction, connection);
      console.log("Transaction sent!", signature);
      await connection.confirmTransaction(signature, "processed");
      console.log("Transaction confirmed!");
      toast.success("Bounty set successfully!");
    } catch (err) {
      toast.error(err);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/quests/create`,
        questData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Quest created successfully!");
      setTitle("");
      setDescription("");
      setBounty(null);
      setStatus("open");
      setQuestions([]);
      setError("");
      setAttempts(null);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="p-6 flex flex-col space-y-3">
      <label htmlFor="title">
        Title of Quest:
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <label htmlFor="description">
        Description of Quest:
        <input
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <div className="flex flex-col border-2 border-black p-3">
        <div className="flex flex-row justify-between px-2">
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
            <label htmlFor="questionText">
              Question Text:
              <input
                type="text"
                name="questionText"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
              />
            </label>
            <label htmlFor="type">
              Option Type:
              <select
                name="type"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
              </select>
            </label>

            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                {type === "text" && (
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option || ""}
                    onChange={(e) => handleOptionChange(e, index)}
                    className="border p-1"
                  />
                )}
                {type === "image" && (
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
      <label htmlFor="bounty">
        Bounty:
        <input
          type="number"
          name="bounty"
          value={bounty || ""}
          onChange={(e) => setBounty(e.target.value)}
          required
        />
      </label>
      <label htmlFor="attempts">
        Attempts:
        <input
          type="number"
          name="attempts"
          value={attempts || ""}
          onChange={(e) => setAttempts(e.target.value)}
          required
        />
      </label>
      <label htmlFor="status">
        Status:
        <select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="draft">Draft</option>
        </select>
      </label>
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 border bg-green-500 text-white"
      >
        Create Quest
      </button>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
    </div>
  );
}
