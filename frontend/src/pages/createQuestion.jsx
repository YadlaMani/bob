import { useState } from "react";
import axios from "axios";

export default function CreateQuestion() {
  const [type, setType] = useState("text");
  const [fileName, setFileName] = useState();
  const [addOption, setAddOption] = useState(false);
  const [options, setOptions] = useState([{ id: 1, value: "" }]);

  const handleFileChange = (file) => {
    setFileName(file.name);
    console.log(file);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    handleFileChange(e.target.files[0]);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      const response = await axios.post(
        "http://localhost:5555/api/v1/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
  
    } catch (err) {
      console.error(err);
     
    }
  };

  const handleAddOption = () => {
    setOptions([...options, { id: options.length + 1, value: "" }]);
  };

  const handleOptionChange = (e, id) => {
    const newOptions = options.map((option) =>
      option.id === id ? { ...option, value: e.target.value } : option
    );
    setOptions(newOptions);
  };

  return (
    <div className="p-6">
      <h2>Create a New Question</h2>
      {/* Form to create a new question */}
      <form action="">
        <label>Question:</label>
        <input type="text" name="question" required />
        <select
          name="type"
          id="type"
          onChange={(e) => setType(e.target.value)}
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>
        {options.map((option) => (
          <div
            key={option.id}
            className="flex flex-row space-x-4 p-2 border-2 w-[fit-content]"
          >
            <input type="radio" name="answer" />
            <label htmlFor="answer">
              {type === "image" ? (
                <div>
                  <label htmlFor="image">Choose image</label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    onChange={handleFileUpload}
                    required
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) => handleOptionChange(e, option.id)}
                />
              )}
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddOption}
          className="my-2 px-4 py-2 border"
        >
          Add one more option
        </button>

        <button type="submit" className="mt-4 px-4 py-2 border">
          Submit
        </button>
      </form>
    </div>
  );
}
