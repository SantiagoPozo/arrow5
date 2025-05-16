import React, { useState, useEffect } from "react";

interface SignalProps {
  children: React.ReactNode;
}

const Signal: React.FC<SignalProps> = ({ children }) => {
  const [visibleChars, setVisibleChars] = useState<number>(0);
  const signal = String(children);

  useEffect(() => {
    if (signal === "") return;

    setVisibleChars(0);
    const intervals: NodeJS.Timeout[] = [];

    // Show each character with 200ms delay
    for (let i = 0; i < signal.length; i++) {
      const timeout = setTimeout(() => {
        setVisibleChars((prev) => prev + 1);
      }, 200 * i);
      intervals.push(timeout);
    }

    return () => {
      intervals.forEach((interval) => clearTimeout(interval));
    };
  }, [signal]);

  if (signal === "") {
    return <div className="signal">∅</div>;
  }

  return (
    <div className="signal">
      {signal.split("").map((char, index) => (
        <div
          key={index}
          className={`signal-char ${char === "=" ? "steady" : "move"}`}
          style={{ visibility: index < visibleChars ? "visible" : "hidden" }}
        >
          {char === "=" ? "◎" : char === ">" ? "🠊" : char === "<" ? "🠈" : ""}
        </div>
      ))}
    </div>
  );
};

export default Signal;
