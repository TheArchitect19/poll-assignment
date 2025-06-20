"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();
  const roles = [
    {
      id: "student",
      title: "I'm a Student",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    },
    {
      id: "teacher",
      title: "I'm a Teacher",
      description: "Submit answers and view live poll results in real-time.",
    },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/${selectedRole}`);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2F2F2] p-8 text-center">
      <span className="bg-gradient-to-r from-[#7765DA] via-[#5767D0] to-[#4F0DCE] text-white text-sm px-4 py-2 rounded-full mb-4 inline-block">
        🔴 Intervue Poll
      </span>

      <h1 className="text-3xl font-semibold mb-2">
        Welcome to the{" "}
        <span className="text-gray-900 font-bold">Live Polling System</span>
      </h1>

      <p className="text-gray-600 text-base max-w-xl mb-8">
        Please select the role that best describes you to begin using the live
        polling system
      </p>

      <div className="flex flex-wrap justify-center gap-6 mb-8">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`w-72 bg-white border-2 rounded-lg p-6 cursor-pointer transition-colors duration-200 hover:border-gray-400
              ${
                selectedRole === role.id
                  ? "border-purple-600 shadow-lg"
                  : "border-gray-200"
              }`}
            onClick={() => setSelectedRole(role.id)}
          >
            <h2 className="text-xl font-semibold mb-2">{role.title}</h2>
            <p className="text-gray-600 text-sm">{role.description}</p>
          </div>
        ))}
      </div>

      <button
        className="bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium px-8 py-3 rounded-full transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleContinue}
        disabled={!selectedRole}
      >
        Continue
      </button>
    </div>
  );
}
