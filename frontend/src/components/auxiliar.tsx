// src/components/auxiliar.tsx
import React from "react";
import openEye from "../assets/open-eye.png";
import closeEye from "../assets/close-eye.png";

export default function renderIcon(
  value: string | React.ReactNode
): React.ReactNode {
  const charMap = {
    "0": "○",
    "1": "●",
    "2": "߶",
    "3": "߷",
    "4": "✧",
    "5": "⚝",
    "6": "᥀",
    "7": "𝟩",
    "8": "ꝏ",
    "9": "९",
    DEL: "DEL",
    SEND: "SEND",
    x: <img src={openEye} alt="Open eye" className="key-icon" />,
    y: <img src={closeEye} alt="Close eye" className="key-icon" />,
  };
  if (typeof value === "string") {
    if (value === "x")
      return <img src={openEye} alt="Open eye" className="key-icon" />;
    if (value === "y")
      return <img src={closeEye} alt="Close eye" className="key-icon" />;
    return charMap[value as keyof typeof charMap];
  }
  return value;
}
