"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import { useRouter } from "next/navigation";

export default function ChatWidget() {
  const router = useRouter();
  const { socket } = useSocket();
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<{ id: string; user: string; text: string; self: boolean }[]>([]);
  const [participants, setParticipants] = useState([
    "Rahul Arora",
    "Pushpender Rautela",
    "Rijul Zalpuri",
    "Nadeem N",
    "Ashwin Sharma",
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    // Load chat history once on mount
    socket.emit("chat_history");

    // Listener for history
    const handleHistory = (history: { timestamp: string; senderName: string; text: string; senderId: string }[]) => {
      const formatted = history.map((msg: { timestamp: string; senderName: string; text: string; senderId: string }) => ({
        id: msg.timestamp,
        user: msg.senderName,
        text: msg.text,
        self: msg.senderId === socket.id,
      }));
      setMessages(formatted);
    };

    // Listener for live messages
    const handleIncoming = (msg: { timestamp: string; senderName: string; text: string; senderId: string }) => {
      const formatted = {
        id: msg.timestamp,
        user: msg.senderName,
        text: msg.text,
        self: msg.senderId === socket.id,
      };
      setMessages((prev) => [...prev, formatted]);
    };

    socket.on("chat_history", handleHistory);
    socket.on("chat_message", handleIncoming);

    return () => {
      socket.off("chat_history", handleHistory);
      socket.off("chat_message", handleIncoming);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTab]);

  const userName =
    typeof window !== "undefined"
      ? sessionStorage.getItem("user_name") || "Anonymous"
      : "Anonymous";
  const sendMessage = () => {
    if (!input.trim() || !socket) return;

    socket.emit("chat_message", {
      name: userName,
      text: input,
    });

    setInput("");
  };

  const kickOut = (name: string) => {
    router.push("/kickout");
    setParticipants(participants.filter((p) => p !== name));
  };

  return (
    <div className="bg-white border rounded-lg shadow-lg w-80 z-50">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "chat"
              ? "border-b-2 border-purple-600 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("chat")}
        >
          Chat
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "participants"
              ? "border-b-2 border-purple-600 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("participants")}
        >
          Participants
        </button>
      </div>

      {/* Content */}
      <div className="h-60 overflow-y-auto p-3">
        {activeTab === "chat" ? (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.self ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-xs">
                  <div
                    className={`text-xs mb-1 ${
                      msg.self
                        ? "text-right text-gray-500"
                        : "text-left text-gray-500"
                    }`}
                  >
                    {msg.user}
                  </div>
                  <div
                    className={`px-3 py-2 rounded-lg text-sm text-white ${
                      msg.self
                        ? "bg-gradient-to-r from-[#7765DA] via-[#5767D0] to-[#4F0DCE]"
                        : "bg-gray-700"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div>
            <div className="flex text-sm font-medium border-b pb-1 mb-2">
              <div className="flex-1">Name</div>
              <div className="w-24 text-right">Action</div>
            </div>
            <ul className="space-y-2">
              {participants.map((p) => (
                <li key={p} className="flex items-center text-sm">
                  <div className="flex-1 text-gray-800">{p}</div>
                  <button
                    onClick={() => kickOut(p)}
                    className="text-purple-600 hover:underline text-sm"
                  >
                    Kick out
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Input */}
      {activeTab === "chat" && (
        <div className="flex items-center border-t p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-[#7765DA] via-[#5767D0] to-[#4F0DCE] text-white px-3 py-2 rounded-r-md text-sm"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
