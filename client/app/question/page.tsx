"use client";

import { useState, useContext, useEffect } from "react";
import ChatWidget from "../components/chat-widget";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
// import { useRouter } from "next/navigation";
import { TimeContext } from "@/context/TimeContext";
import { useSocket } from "@/context/SocketContext";
import WaitingPage from "../waiting/page";

export interface PollData {
  id: string;
  question: string;
  options: string[];
  duration: number;
  start: number;
  answers: { [key: string]: number } | null;
  correctAnswer: number;
}

export default function Question() {
  // const router = useRouter();
  const { socket } = useSocket();
  const role = "student";

  const [poll, setPoll] = useState<PollData | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const { timeLeft } = useContext(TimeContext);

  useEffect(() => {
    socket?.on("new_poll", (p: PollData) => {
      setPoll(p);
      // setSelected(p.answers);
      setCounts({});
    });
    socket?.on("live_update", ({ counts }) => setCounts(counts));
    socket?.on("poll_results", ({ results }) => {
      setCounts(
        results.reduce(
          (acc: Record<string, number>, r: { option: string; votes: number }) => ({ ...acc, [r.option]: r.votes }),
          {}
        )
      );
    });
    return () => {
      socket?.off("new_poll");
      socket?.off("live_update");
      socket?.off("poll_results");
    };
  }, [socket]);

  if (!poll) {
    console.log(counts);
    return (
      <>
        <WaitingPage />
      </>
    );
  }

  const canSelect = timeLeft > 0;
  const buttonLabel = timeLeft > 0 ? "Submit" : "Go to Result";

  const handleOptionClick = (idx: number) => {
    if (canSelect) {
      setSelected(idx);
    }
  };

  const gotoResult = () => {
    const answer = selected !== null ? poll.options[selected] : null;
    console.log(answer);
    socket?.emit("answer_poll", { pollId: poll.id, answer });
    window.location.href = `/question/result?role=${encodeURIComponent(role)}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2F2F2] p-8">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Question 1</h2>
          <div className="flex items-center text-red-600 font-medium">
            ⏲️
            <span className="ml-1">00:{String(timeLeft).padStart(2, "0")}</span>
          </div>
        </div>

        <div className="border border-purple-500 rounded-lg overflow-hidden">
          <div className="bg-gray-700 text-white px-4 py-2 font-medium">
            {poll.question}
          </div>
          <div className="p-4 space-y-3">
            {poll.options.map((opt, idx) => (
              <div
                key={idx}
                onClick={() => handleOptionClick(idx)}
                className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200
                  ${
                    canSelect
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  }
                  ${
                    selected === idx && canSelect
                      ? "border-2 border-purple-500 bg-white"
                      : "bg-gray-100"
                  }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 text-white
                    ${
                      selected === idx && canSelect
                        ? "bg-gradient-to-r from-[#7765DA] via-[#5767D0] to-[#4F0DCE]"
                        : "bg-gray-400"
                    }`}
                >
                  {idx + 1}
                </span>
                <span className="text-gray-800">{opt}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={gotoResult}
            // disabled={isDisabled}
            className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-3 rounded-full disabled:opacity-50"
          >
            {buttonLabel}
          </button>
        </div>
      </div>

      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-[#7765DA] via-[#5767D0] to-[#4F0DCE] p-4 rounded-full text-white shadow-lg z-50"
      >
        <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />
      </button>

      {/* Chat widget overlay */}
      {chatOpen && (
        <div className="fixed bottom-20 right-6 z-50">
          <ChatWidget />
        </div>
      )}
    </div>
  );
}
