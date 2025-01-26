"use client";
import React, { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 mt-5 rounded-lg px-4 py-2 flex items-center justify-between w-full max-w-4xl mx-auto shadow-lg 
      ${isDarkMode ? "bg-black text-white" : "bg-white text-black"} border ${
        isDarkMode ? "border-gray-600" : "border-gray-300"
      }`}
    >
      <div className="flex items-center space-x-2">
        <img
          alt="Logo"
          className="rounded-full"
          height="40"
          src="https://placehold.co/40x40"
          width="40"
        />
        <span className="font-semibold">Bob</span>
      </div>
      <div className="flex items-center space-x-4">
        <a className="px-2 py-1" href="#">
          Quest
        </a>
        <a className="px-2 py-1" href="#">
          Create
        </a>
        <a className="px-2 py-1" href="#">
          Dashboard
        </a>
        <button className="px-2 py-1 flex items-center" onClick={toggleTheme}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        <a className="px-2 py-1" href="#">
          Login/Signup
        </a>
        <a className="px-2 py-1" href="#">
          Wallet
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
