import { useState } from "react";
import axios from "axios";

export default function CreateQuestion() {
  const [type, setType] = useState("text");
  const [fileName, setFileName] = useState();
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
      alert("File uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to upload file");
    }
  };

  return (
    <div>
      <h2>Create a New Question</h2>
      {/* Form to create a new question */}
      <form action="">
        <label>Question:</label>
        <input type="text" name="question" required />
        <select name="type" id="type" onChange={(e) => setType(e.target.value)}>
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>
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
          <div>Text selected</div>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
