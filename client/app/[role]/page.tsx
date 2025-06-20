"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RoleStartPage() {
  const router = useRouter();
  const { role } = useParams();
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    if (role === "student") {
      setSubtitle(
        "If you’re a student, you’ll be able to submit your answers, participate in live polls, and see how your responses compare with your classmates"
      );
    } else if (role === "teacher") {
      setSubtitle(
        "As a teacher, you can create polls, view live responses, and analyze class performance in real-time"
      );
    } else {
      setSubtitle("Welcome! Please enter your name to continue.");
    }
  }, [role]);

  const handleContinue = () => {
    if (!name.trim()) return;

    sessionStorage.setItem("user_name", name);

    if (role === "student") {
      router.push(`/question`);
    } else if (role === "teacher") {
      router.push(`/add-question`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2F2F2] p-8 text-center">
      <span className="bg-gradient-to-r from-[#7765DA] via-[#5767D0] to-[#4F0DCE] text-white text-sm px-4 py-2 rounded-full mb-4 inline-block">
        🔴 Intervue Poll
      </span>

      <h1 className="text-3xl font-semibold mb-2">
        Let’s <span className="text-gray-900 font-bold">Get Started</span>
      </h1>

      <p className="text-gray-600 text-base max-w-2xl mb-8">{subtitle}</p>

      <div className="w-full max-w-md text-left mb-6">
        <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
          Enter your Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder=""
        />
      </div>

      <button
        onClick={handleContinue}
        disabled={!name.trim()}
        className="bg-[#7765DA] text-white font-medium px-8 py-3 rounded-full transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}
