import React, { useState, useEffect } from "react";

interface ResultCharProps {
  children: React.ReactNode;
}

const ResultChar: React.FC<ResultCharProps> = ({ children }) => {
  const [visibleChars, setVisibleChars] = useState<number>(0);
  const result = String(children);

  useEffect(() => {
    if (result === "") return;

    setVisibleChars(0);
    const intervals: NodeJS.Timeout[] = [];

    // Show each character with 200ms delay
    for (let i = 0; i < result.length; i++) {
      const timeout = setTimeout(() => {
        setVisibleChars((prev) => prev + 1);
      }, 200 * i);
      intervals.push(timeout);
    }

    return () => {
      intervals.forEach((interval) => clearTimeout(interval));
    };
  }, [result]);

  if (result === "") {
    return <div className="result">∅</div>;
  }

  return (
    <div className="result">
      {result.split("").map((char, index) => (
        <div
          key={index}
          className={`result-char ${char === "=" ? "steady" : "move"}`}
          style={{ visibility: index < visibleChars ? "visible" : "hidden" }}
        >
          {char === "=" ? "◎" : char === ">" ? "🠊" : char === "<" ? "🠈" : ""}
        </div>
      ))}
    </div>
  );
};

export default ResultChar;
