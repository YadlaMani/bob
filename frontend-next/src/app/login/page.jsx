"use client";
import axios from "axios";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Carousel } from "@/components/ui/Carousel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [type, setType] = useState("email");
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);

    if (!emailOrUsername || !password) {
      setError("All fields are required");
      return;
    }

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

      localStorage.setItem("token", token);
      router.push("/");
      toast.success("Logged in successfully");
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Something went wrong"
      );
      toast.error("Invalid creditionals");
    } finally {
      setLoading(true);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block lg:w-1/2 relative">
        <Carousel />
      </div>

      <div className="w-full lg:w-1/2 bg-[#1A1F2C] p-8 lg:p-20 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="flex justify-between items-center mb-12">
            <Link href="/">
              <button className="text-white/80 hover:text-white px-4 py-2 rounded-full bg-white/10">
                Back to website
              </button>
            </Link>
          </div>

          <h1 className="text-4xl font-semibold text-white mb-4">
            Welcome back
          </h1>
          <p className="text-gray-400 mb-8">
            Don't have an account?{" "}
            <a href="/register" className="text-white hover:underline">
              Sign up
            </a>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="emailOrUsername" className="text-white">
                  Email or Username
                </Label>
                <Input
                  id="emailOrUsername"
                  type="text"
                  placeholder="Enter your email or username"
                  className="form-input"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="loginType" className="text-white">
                  Login with
                </Label>
                <select
                  id="loginType"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600"
                >
                  <option value="email">Email</option>
                  <option value="username">Username</option>
                </select>
              </div>
            </div>
            {loading ? (
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-md transition-colors"
              >
                Login
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-md transition-colors"
                disabled
              >
                Loading...
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
