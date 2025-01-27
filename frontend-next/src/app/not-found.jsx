"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="max-w-2xl w-full text-center">
        <Image
          src="/notfound.png"
          alt="hero"
          width={1000}
          height={600}
          className="rounded-lg"
        />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-500 transition"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
