"use client";
import axios from "axios";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Carousel } from "@/components/ui/Carousel";
import { useRouter } from "next/navigation";


const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Next.js router

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError("");

    // Basic client-side validation
    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/signup`, {
        username,
        email,
        password,
      });

      // Navigate to login page on successful registration
      router.push("/login");
    } catch (err) {
      // Enhanced error handling
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen">
    {/* Left Section */}
    <div className="hidden lg:block lg:w-1/2 relative">
      <Carousel />
    </div>

    {/* Right Section */}
    <div className="w-full lg:w-1/2 bg-[#1A1F2C] p-8 lg:p-20 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="flex justify-between items-center mb-12">
         
          <a href="/" className="text-white/80 hover:text-white px-4 py-2 rounded-full bg-white/10">
            Back to website
          </a>
        </div>

        <h1 className="text-4xl font-semibold text-white mb-4">Create an account</h1>
        <p className="text-gray-400 mb-8">
          Already have an account?{" "}
          <a href="/login" className="text-white hover:underline">
            Log in
          </a>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-white">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="form-input"
                value={username}
                onChange={(e) => setUsername( e.target.value )}
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail( e.target.value )}
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="form-input"
                value={password}
                onChange={(e) => setPassword( e.target.value )}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-md transition-colors"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  </div>
  );
};

export default Register;
