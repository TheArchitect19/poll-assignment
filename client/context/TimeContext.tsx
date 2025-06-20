"use client";

import React, { createContext, ReactNode, useState, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";

interface TimeContextProps {
  timeLeft: number;
  showRedirectMessage: boolean;
}

interface TimeProviderProps {
  children: ReactNode;
  initialSeconds?: number;
}

export const TimeContext = createContext<TimeContextProps>({
  timeLeft: 0,
  showRedirectMessage: false,
});

export function TimeProvider({
  children,
  initialSeconds = 15,
}: TimeProviderProps) {
  const { socket } = useSocket();
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [showRedirectMessage, setShowRedirectMessage] =
    useState<boolean>(false);
  useEffect(() => {
    // Reset timer when teacher issues a new poll
    const handleNewPoll = (poll: { duration: number }) => {
      setTimeLeft(poll.duration);
      setShowRedirectMessage(false);
    };
    socket?.on("new_poll", handleNewPoll);
    return () => {
      socket?.off("new_poll", handleNewPoll);
    };
  }, [socket]);
  useEffect(() => {
    let countdownTimer: ReturnType<typeof setTimeout>;
    let redirectDelay: ReturnType<typeof setTimeout>;
    let finalRedirect: ReturnType<typeof setTimeout>;

    if (timeLeft > 0) {
      countdownTimer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else {
      redirectDelay = setTimeout(() => {
        setShowRedirectMessage(true);
        finalRedirect = setTimeout(() => {}, 2000);
      }, 5000);
    }

    return () => {
      clearTimeout(countdownTimer);
      clearTimeout(redirectDelay);
      clearTimeout(finalRedirect);
    };
  }, [timeLeft]);

  return (
    <TimeContext.Provider value={{ timeLeft, showRedirectMessage }}>
      {children}
    </TimeContext.Provider>
  );
}
