"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";

export default function AddQuestionPage() {
  const subtitle =
    "you will have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.";

  const role = "teacher";
  const [question, setQuestion] = useState("");
  const [timer, setTimer] = useState("60");
  const [options, setOptions] = useState(["", ""]);
  const { socket } = useSocket();
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);

  useEffect(() => {
    console.log("✅ correctIndex is now", correctIndex);
  }, [correctIndex]);

  const handleOptionChange = (idx: number, value: string) => {
    const updated = [...options];
    updated[idx] = value;
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const gotoresult = () => {
    socket?.emit("create_poll", {
      question,
      options,
      correctAnswer: correctIndex,
      duration: Number(timer),
    });

    window.location.href = `/question/result?role=${encodeURIComponent(role)}`;
  };
  const canAsk = question.trim() !== "" && correctIndex !== null;

  return (
    <div className=" flex flex-col items-start justify-center bg-[#F2F2F2]  text-center">
      <div className="h-[88vh] overflow-auto w-full flex flex-col items-start bg-[#F2F2F2] p-16 text-center">
        <span className="bg-gradient-to-r from-[#7765DA] via-[#5767D0] to-[#4F0DCE] text-white text-sm px-4 py-2 rounded-full mb-4 inline-block">
          🔴 Intervue Poll
        </span>

        <h1 className="text-3xl font-semibold mb-2">
          Let’s <span className="text-gray-900 font-bold">Get Started</span>
        </h1>

        <p className="text-gray-600 text-base max-w-xl mb-4 text-left">
          {subtitle}
        </p>

        <div className="w-full max-w-3xl text-left">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-gray-700 font-bold">
              Enter your question
            </label>
            <select
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
              className=" border border-gray-200 rounded-md px-3 py-2 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="30">30 seconds</option>
              <option value="60">60 seconds</option>
              <option value="90">90 seconds</option>
            </select>
          </div>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value.slice(0, 100))}
            placeholder="Type your question..."
            className="w-full bg-gray-100 border border-gray-200 rounded-lg p-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="text-right text-gray-600 mt-1">
            {question.length}/100
          </div>

          <div className="grid grid-cols-2 gap-8 mt-8">
            <div>
              <p className="font-medium mb-2">Edit Options</p>
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center mb-4">
                  <span className="w-6 h-6 mr-2 bg-gradient-to-r from-[#7765DA] via-[#5767D0] to-[#4F0DCE] text-white rounded-full flex items-center justify-center font-semibold">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className="flex-1 bg-gray-100 border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={`Option ${idx + 1}`}
                  />
                </div>
              ))}
              <button
                onClick={addOption}
                className="mt-2 text-purple-600 border border-purple-600 px-4 py-2 rounded-md"
              >
                + Add More option
              </button>
            </div>

            <div>
              <p className="font-medium mb-2">Is it Correct?</p>
              {options.map((_, idx) => (
                <div key={idx} className="flex items-center mb-4">
                  <input
                    id={`option-${idx}`}
                    type="radio"
                    name="correct"
                    value={idx}
                    checked={correctIndex === idx}
                    onChange={() => setCorrectIndex(idx)}
                    className="mr-2 cursor-pointer"
                  />
                  <label htmlFor={`option-${idx}`} className="text-gray-700">
                    Option {idx + 1}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full justify-end px-16 py-4 ">
        <button
          disabled={!canAsk}
          className="bg-gradient-to-r from-[#7765DA] to-[#5767D0] text-white px-6 py-3 rounded-full disabled:opacity-50"
          onClick={gotoresult}
        >
          Ask Question
        </button>
      </div>
    </div>
  );
}
