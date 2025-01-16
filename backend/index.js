import express from "express";

const app = express();
app.use(express.json());
app.listen("5555", () => {
  console.log("Server is running on port 5555");
});
app.get("/", (req, res) => {
  res.send("API is running...");
});
