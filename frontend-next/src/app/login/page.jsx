"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Meteors } from "@/components/ui/meteors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [type, setType] = useState("email");
  const router = useRouter(); // Updated for proper navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!emailOrUsername || !password) {
      setError("All fields are required");
      return;
    }

    // Clear previous error
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/login`,
        {
          emailOrUsername,
          password,
          type,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token } = response.data;

      // Store the token securely (localStorage here, but httpOnly cookies are safer)
      localStorage.setItem("token", token);

      // Redirect to the homepage
      router.push("/");
    } catch (err) {
      // Enhanced error handling
      setError(
        err?.response?.data?.message || err.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-between bg-black text-white px-6 lg:px-20">
      {/* Background meteors animation */}
      <Meteors number={30} className="absolute inset-0 z-0" />

      {/* Left Section */}
      <div className="w-full max-w-lg lg:w-1/2 text-center lg:text-left z-10">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Log In to <span className="text-blue-500">BOB</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Welcome back! Please enter your credentials to continue.
        </p>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md bg-gray-900 bg-opacity-80 rounded-lg shadow-lg p-8 lg:w-1/3 z-10 relative">
        <h2 className="text-2xl font-semibold text-center mb-6 text-white">
          Log In
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Email or Username */}
          <div className="mb-4">
            <Label htmlFor="emailOrUsername" className="text-white">
              Email or Username
            </Label>
            <Input
              id="emailOrUsername"
              placeholder="Enter your email or username"
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Login Type */}
          <div className="mb-4">
            <Label htmlFor="loginType" className="text-white">
              Login with
            </Label>
            <select
              id="loginType"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="email">Email</option>
              <option value="username">Username</option>
            </select>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-br from-blue-600 to-purple-500 text-white font-bold py-3 rounded-lg transition-colors duration-200"
          >
            Login
          </button>
        </form>

        {/* Redirect to Register */}
        <p className="text-center mt-4 text-sm text-white">
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
