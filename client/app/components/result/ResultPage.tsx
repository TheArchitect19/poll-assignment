"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import ChatWidget from "../../components/chat-widget";
import { TimeContext } from "@/context/TimeContext";
import { useSocket } from "@/context/SocketContext";
import { PollData } from "@/app/question/page";
import WaitingPage from "@/app/waiting/page";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const router = useRouter();
  const { socket } = useSocket();
  const [showRedirectMsg, setShowRedirectMsg] = useState(false);
  const [poll, setPoll] = useState<PollData | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [chatOpen, setChatOpen] = useState(false);
  const { timeLeft } = useContext(TimeContext);

  // Subscribe to socket events
  useEffect(() => {
    const onNew = (p: PollData) => {
      console.log("new_poll received", p);
      setPoll(p);
      // initialize counts from answers object
      const init: Record<string, number> = {};
      p.options.forEach((opt) => (init[opt] = 0));
      Object.values(p.answers || {}).forEach((ans) => {
        if (init[ans] !== undefined) init[ans]++;
      });
      setCounts(init);
    };
    const onLive = ({ counts }: { counts: Record<string, number> }) =>
      setCounts(counts);
    const onResults = ({
      results,
    }: {
      results: { option: string; votes: number }[];
    }) => {
      const updated: Record<string, number> = {};
      results.forEach((r) => {
        updated[r.option] = r.votes;
      });
      setCounts(updated);
    };

    socket?.on("new_poll", onNew);
    // socket?.emit('get_active_poll');
    socket?.on("live_update", onLive);
    socket?.on("poll_results", onResults);

    return () => {
      socket?.off("new_poll", onNew);
      socket?.off("live_update", onLive);
      socket?.off("poll_results", onResults);
    };
  }, [socket]);

  // Redirect logic for student
  useEffect(() => {
    let redirectDelay: NodeJS.Timeout;
    let finalRedirect: NodeJS.Timeout;
    if (role === "student" && timeLeft <= 0) {
      redirectDelay = setTimeout(() => {
        setShowRedirectMsg(true);
        finalRedirect = setTimeout(() => {
          router.push("/question");
        }, 2000);
      }, 5000);
    }
    return () => {
      clearTimeout(redirectDelay);
      clearTimeout(finalRedirect);
    };
  }, [role, timeLeft, router]);

  // No poll yet
  if (!poll) {
    // router.push("/add-question");
    return (
      <>
        <WaitingPage />
      </>
    );
  }

  // Compute total answers for percentages
  const totalAnswers =
    Object.values(counts).reduce((sum, v) => sum + v, 0) || 1;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#F2F2F2] p-8">
      <div className="w-full max-w-2xl">
        {/* STUDENT VIEW */}
        {role === "student" && (
          <>
            {timeLeft === 0 && !showRedirectMsg && (
              <div className="text-gray-600 mb-4">
                Time’s up! Redirecting you in 5 seconds…
              </div>
            )}
            {showRedirectMsg && (
              <div className="text-lg font-semibold mb-4">
                You’ll now be taken to the next question…
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Question</h2>
              <div className="flex items-center text-red-600 font-medium">
                ⏲️{" "}
                <span className="ml-1">
                  00:{String(timeLeft).padStart(2, "0")}
                </span>
              </div>
            </div>
          </>
        )}

        {/* Render results for both roles */}
        <div className="border border-purple-500 rounded-lg overflow-hidden">
          <div className="bg-gray-700 text-white px-4 py-2 font-medium">
            {poll?.question}
          </div>
          <div className="p-4 space-y-3">
            {poll?.options.map((opt, idx) => {
              const voteCount = counts[opt] || 0;
              const percent = Math.round((voteCount / totalAnswers) * 100);
              return (
                <div
                  key={idx}
                  className="relative bg-gray-100 rounded-md overflow-hidden"
                >
                  <div className="flex items-center px-4 py-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 mr-3 rounded-full bg-gradient-to-r from-[#7765DA] via-[#5767D0] to-[#4F0DCE] text-white font-semibold">
                      {idx + 1}
                    </span>
                    <span className="text-gray-800 flex-1">{opt}</span>
                    <span className="text-gray-800 ml-4 font-medium">
                      {percent}%
                    </span>
                  </div>
                  <div
                    className="absolute top-0 left-0 h-full bg-purple-500 opacity-50"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* TEACHER VIEW Controls */}
        {role === "teacher" && (
          <div className="text-right mt-6">
            <button
              onClick={() => router.push("/add-question")}
              className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-3 rounded-full"
            >
              + Ask a new question
            </button>
          </div>
        )}

        {/* STUDENT Footer Message */}
        {role === "student" && (
          <div className="text-center mt-6 font-medium">
            Wait for the teacher to ask a new question..
          </div>
        )}
      </div>

      {/* Chat toggle button (both roles) */}
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
