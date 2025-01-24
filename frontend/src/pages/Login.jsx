import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [type, setType] = useState("email");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/login`,
        {
          emailOrUsername: emailOrUsername,
          password,
          type,
        }
      );

      const { token } = response.data;
      localStorage.setItem("token", token);

      navigate("/protected");
    } catch (err) {
      console.log(err.message);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-between bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-6 lg:px-20">
      {/* Left Side - Text and Illustration */}
      <div className="w-full max-w-lg lg:w-1/2 text-center lg:text-left">
        <h1 className="text-4xl font-bold mb-4">
          Sign In to <span className="text-blue-500">BOB</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 underline">
            Register here!
          </a>
        </p>
        {/* Add an illustrative image */}
        <div className="mt-6">
          <img
            src="https://via.placeholder.com/300"
            alt="Illustration of a character falling"
            className="w-64 mx-auto lg:mx-0"
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8 lg:w-1/3">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Email or Username:
            </label>
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Login with:
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="email">Email</option>
              <option value="username">Username</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
