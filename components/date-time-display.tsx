"use client";

import { useState, useEffect } from "react";

export function DateTimeDisplay() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Only set time on client-side to avoid hydration mismatch
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Render nothing on server, render time only on client
  if (!currentTime) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 text-center font-mono">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 text-center font-mono">
      {currentTime.toLocaleString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })}
    </div>
  );
}
