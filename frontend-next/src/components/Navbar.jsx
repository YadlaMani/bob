"use client";
import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [token, setToken] = useState(null);
  const router = useRouter();
  const [loading,setLoading]=useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  function callLogout() {
    localStorage.removeItem("token");
    window.location.reload();
    toast.success("Logged out successfully");
    router.push("/");
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 mt-5 rounded-lg px-4 py-2 flex  items-center justify-between w-full max-w-4xl mx-auto shadow-md transition-colors duration-300
      ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"} border 
      ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}
    >
      {/* Navigation items container */}
      <div className="flex items-center space-x-4 ml-auto flex-grow justify-between">
        <Link href="/" className="flex items-center space-x-2 mr-4">
          <img
            alt="Logo"
            className="rounded-full"
            height="32"
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.ULC-eiskdEGCiSg4KQab9gHaFj%26pid%3DApi&f=1&ipt=2836803f2e42526fcdccac3a26d8c7c43bfa8d038d9e6e67ea1f68b247e5030a&ipo=images"
            width="32"
          />
          <span className="font-semibold text-xl">Bob</span>
        </Link>
        <Button variant="ghost" asChild className="text-base font-medium">
          <Link href="/quests">Quest</Link>
        </Button>
        <Button variant="ghost" asChild className="text-base font-medium">
          <Link href="/create">Create</Link>
        </Button>
        <Button variant="ghost" asChild className="text-base font-medium">
          <Link href="/profile">Dashboard</Link>
        </Button>
        <Button variant="ghost" asChild className="text-base font-medium">
          <Link href="/leaderboard">Leaderboard</Link>
        </Button>

        {/* Theme toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="w-10 h-10 p-0 flex items-center justify-center"
        >
          {isDarkMode ? (
            <FaSun className="h-5 w-5" />
          ) : (
            <FaMoon className="h-5 w-5" />
          )}
        </Button>

        {/* Logout or Login Button */}
        {token ? (
          <Button
            variant="destructive"
            onClick={callLogout}
            className="px-4 h-10 text-base font-medium"
          >
           Logout
            
          </Button>
        ) : (
          <Button
            variant="secondary"
            asChild
            className="px-4 h-10 text-base font-medium"
          >
            <Link href="/login">Login/Signup</Link>
          </Button>
        )}

        {/* Wallet multi-button */}
        <WalletMultiButton className="!bg-purple-500 hover:!bg-purple-600 rounded-md px-4 h-10 text-base font-medium" />
      </div>
    </nav>
  );
};

export default Navbar;
