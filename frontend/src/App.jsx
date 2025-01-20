// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateQuestion from "./pages/createQuestion";
import { Toaster } from "sonner";
import AnswerQuestion from "./pages/AnswerQuestion";
import Home from "./pages/Home";
import "./index.css";

const App = () => {
  return (
    <Router>
      <Toaster />
      <div>
        <h1>App</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreateQuestion />} />
          <Route path="/answer/:id" element={<AnswerQuestion />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
