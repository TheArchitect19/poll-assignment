"use client";

import { useEffect, useState } from "react";


interface Poll {
  question: string;
  answers?: Record<string, string>;
}

export default function PollHistory() {
  const [history, setHistory] = useState<
    { id: number; question: string; results: { text: string; percent: number }[] }[]
  >([]);

  useEffect(() => {
    

    const fetchHistory = async () => {
      try {
        const res = await fetch("http://13.204.38.91:4000/api/polls");
        const data: Poll[] = await res.json();

        // transform backend poll data into result format
        const transformed = data.map((poll: Poll, index: number) => ({
          id: index + 1,
          question: poll.question,
          results: Object.entries(poll.answers || {}).map(
            ([text, percent]) => ({
              text,
              percent: parseInt(percent.replace("%", "")), // convert "76%" → 76
            })
          ),
        }));

        setHistory(transformed);
      } catch (err) {
        console.error("Failed to fetch poll history:", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#F2F2F2]">
      <div className=" flex  flex-col items-start w-1/2">
        <h1 className="text-3xl font-semibold mb-6">
          View <span className="text-gray-900 font-bold">Poll History</span>
        </h1>
        <div className="space-y-8 overflow-y-auto w-full max-h-[calc(100vh-100px)] pr-4">
          {history.map((item) => (
            <div key={item.id} className=" rounded-lg">
              <h2 className="text-lg font-medium mb-2">Question {item.id}</h2>
              <div className="border border-purple-500 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-[#373737] to-[#6E6E6E]   text-white px-4 py-2 font-medium">
                  {item.question}
                </div>
                <div className="p-4 space-y-3">
                  {item.results.map((opt, idx) => (
                    <div
                      key={idx}
                      className="relative bg-gray-100 rounded-md overflow-hidden"
                    >
                      <div className="flex items-center px-4 py-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 mr-3 rounded-full bg-gradient-to-r from-[#7765DA] via-[#5767D0] to-[#4F0DCE] text-white font-semibold">
                          {idx + 1}
                        </span>
                        <span className="text-gray-800 flex-1">{opt.text}</span>
                        <span className="text-gray-800 ml-4 font-medium">
                          {opt.percent}%
                        </span>
                      </div>
                      <div
                        className="absolute top-0 left-0 h-full bg-purple-500 opacity-50"
                        style={{ width: `${opt.percent}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
