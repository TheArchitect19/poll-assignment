"use client";

import { useState } from "react";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import ChatWidget from "../components/chat-widget";

export default function WaitingPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white p-8">
      <span className="bg-gradient-to-r from-[#7765DA] via-[#5767D0] to-[#4F0DCE] text-white text-sm px-4 py-2 rounded-full mb-4 inline-block">
        🔴 Intervue Poll
      </span>

      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600 mb-6" />
      <h1 className="text-xl font-semibold mb-2">
        Wait for the teacher to ask questions..
      </h1>

      {/* Chat toggle button */}
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
