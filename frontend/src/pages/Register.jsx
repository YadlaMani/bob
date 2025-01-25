import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Meteors } from "../components/ui/meteors";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5555/api/v1/signup", {
        username,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-between bg-black text-white px-6 lg:px-20">
      <Meteors number={30} className="absolute inset-0 z-0" />

      <div className="w-full max-w-lg lg:w-1/2 text-center lg:text-left z-10">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Sign In to <span className="text-blue-500">BOB</span>
        </h1>
        <p className="text-gray-400 text-lg">
          If you’re looking for a data labeling platform for data scientists or a polling platform for option seekers, you can explore our services
        </p>
      </div>

      <div className="w-full max-w-md bg-gray-900 bg-opacity-80 rounded-lg shadow-lg p-8 lg:w-1/3 z-10 relative">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="username" className="text-white">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-br from-blue-600 to-purple-500 text-white font-bold py-3 rounded-lg transition-colors duration-200"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-white">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-500 hover:underline"
          >
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
