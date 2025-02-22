import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BadgeCheck,
  Wallet,
  Trophy,
  Clock,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";

const Profile = () => {
  // Redirect to login if token is missing
  if (!localStorage.getItem("token")) {
    window.location.href = "/login";
    return null;
  }

  const wallet = useWallet();
  const [user, setUser] = useState(null);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = React.useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    fetchUserDetails();
    fetchUserQuests();
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  };

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser(response.data[0]);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load user details");
      setLoading(false);
    }
  };

  // Fetch user's quests
  const fetchUserQuests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/quests`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setQuests(response.data);
    } catch (error) {
      toast.error("Failed to load quests");
    }
  };

  // Handle withdraw
  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!wallet) {
      toast.error("Connect wallet to withdraw");
      return;
    }

    try {
      const data = {
        pubKey: wallet.publicKey.toString(),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/withdraw`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Withdraw failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF4001]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 px-4 py-2 text-white bg-[#FF4001] rounded-lg hover:bg-opacity-90 transition z-50"
      >
        Toggle Dark Mode
      </button>

      {user && (
        <>
          {/* Profile Header */}
          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-[#FF4001] to-[#FF6B4A]"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative -mt-24">
                <div className="flex flex-col md:flex-row items-start gap-6 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.username}
                      </h1>
                      <BadgeCheck className="w-6 h-6 text-[#FF4001]" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {user.email}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-[#FF4001]" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Balance: ${user.balance}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-[#FF4001]" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Total Earnings: ${user.earnings}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleWithdraw}
                      className="mt-4 px-6 py-2 bg-[#FF4001] text-white rounded-lg hover:bg-opacity-90 transition flex items-center gap-2"
                    >
                      <Wallet className="w-4 h-4" />
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Earnings History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Earnings History
                </h2>
                {user.earningsHistory && user.earningsHistory.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={user.earningsHistory.map((earning) => ({
                          date: new Date(earning.time).toLocaleDateString(),
                          amount: earning.amount,
                        }))}
                      >
                        <XAxis dataKey="date" stroke="#888888" />
                        <YAxis stroke="#888888" />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="#FF4001"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    No earnings history available.
                  </p>
                )}
              </motion.div>

              {/* Created Quests */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Created Quests
                </h2>
                <div className="space-y-4">
                  {quests.length > 0 ? (
                    quests.map((quest) => (
                      <a
                        href={`/questStats/${quest._id}`}
                        key={quest._id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {quest.title}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                quest.status === "Active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                              }`}
                            >
                              {quest.status}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Trophy className="w-4 h-4" />
                              {quest.bounty} BOB
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(quest.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-gray-400" />
                      </a>
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      No quests created yet.
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
