"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
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

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  async function fetchUserDetails() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${id}`
      );
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load user details", error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dynamic-black transition-colors duration-200">
      {user && (
        <>
          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-teal-500 to-teal-400"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative -mt-24">
                <div className="flex flex-col md:flex-row items-start gap-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.-BlB7b1kiPwqWSeg32WAPAHaHa%26pid%3DApi&f=1&ipt=54451f5b8936d1457ccc077fc66b8d00d71922fd6d76a400e747c607b1b38dd5&ipo=images"
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-700"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                        {user.username}
                      </h1>
                      <BadgeCheck className="w-6 h-6 text-teal-500" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Country: {user.country}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-teal-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Total Earnings: ${user.earnings}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl"
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
                        stroke="#4C6E92"
                        strokeWidth={3}
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col gap-4"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Quests
              </h2>
              {user.quest.length > 0 ? (
                user.quest.map((quest, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {quest.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {quest.description || "No description available."}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No quests available.
                </p>
              )}
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
