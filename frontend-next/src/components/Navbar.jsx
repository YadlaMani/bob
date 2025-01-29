"use client";
import React, { useState, useEffect } from "react";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [token, setToken] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

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
    document.documentElement.classList.add("dark");
  }, []);

  function callLogout() {
    localStorage.removeItem("token");
    window.location.reload();
    toast.success("Logged out successfully");
    router.push("/");
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 mt-5 rounded-lg px-4 py-2 w-full max-w-6xl mx-auto shadow-md transition-colors duration-300
        ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"} border 
        ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}
      >
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2">
            <img
              alt="Logo"
              className="rounded-full"
              height="32"
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.ULC-eiskdEGCiSg4KQab9gHaFj%26pid%3DApi&f=1&ipt=2836803f2e42526fcdccac3a26d8c7c43bfa8d038d9e6e67ea1f68b247e5030a&ipo=images"
              width="32"
            />
            <span className="font-semibold text-xl">Bob</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FaTimes className="h-5 w-5" />
            ) : (
              <FaBars className="h-5 w-5" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-8">
              <Link
                href="/quests"
                className="text-base font-medium hover:text-gray-300"
              >
                Quest
              </Link>
              <Link
                href="/create"
                className="text-base font-medium hover:text-gray-300"
              >
                Create
              </Link>
              <Link
                href="/profile"
                className="text-base font-medium hover:text-gray-300"
              >
                Dashboard
              </Link>
              <Link
                href="/leaderboard"
                className="text-base font-medium hover:text-gray-300"
              >
                Leaderboard
              </Link>
              <Link
                href="/forum"
                className="text-base font-medium hover:text-gray-300"
              >
                Forum
              </Link>
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-10 h-10"
            >
              {isDarkMode ? (
                <FaSun className="h-5 w-5" />
              ) : (
                <FaMoon className="h-5 w-5" />
              )}
            </Button>

            {token ? (
              <Button
                variant="destructive"
                onClick={callLogout}
                className="px-4 h-10"
              >
                Logout
              </Button>
            ) : (
              <Button variant="secondary" asChild className="px-4 h-10">
                <Link href="/login">Login/Signup</Link>
              </Button>
            )}

            <WalletMultiButton className="!bg-purple-500 hover:!bg-purple-600 rounded-md" />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } md:hidden fixed top-[calc(5rem+1px)] left-0 right-0 flex-col items-center space-y-4 py-4 bg-gray-900 border border-gray-700 rounded-lg z-40`}
      >
        <Link href="/quests" className="text-base font-medium">
          Quest
        </Link>
        <Link href="/create" className="text-base font-medium">
          Create
        </Link>
        <Link href="/profile" className="text-base font-medium">
          Dashboard
        </Link>
        <Link href="/leaderboard" className="text-base font-medium">
          Leaderboard
        </Link>
        <Link href="/forum" className="text-base font-medium">
          Forum
        </Link>
        {token ? (
          <Button variant="destructive" onClick={callLogout}>
            Logout
          </Button>
        ) : (
          <Button variant="secondary" asChild>
            <Link href="/login">Login/Signup</Link>
          </Button>
        )}
        <WalletMultiButton className="!bg-purple-500 hover:!bg-purple-600 rounded-md" />
      </div>

      {/* Spacer to push content down */}
      <div className="h-[calc(5rem+1px)]"></div>
    </>
  );
};

export default Navbar;
