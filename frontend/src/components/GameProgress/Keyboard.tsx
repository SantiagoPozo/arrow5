import React, { useState } from "react";
import { KeyInput as BaseKeyInput } from "../types";
import renderIcon from "../auxiliar";

// Extend KeyInput type to include color actions
type KeyInput =
  | BaseKeyInput
  | {
      type: "action";
      action: "spySaysNo" | "spySaysYes" | "clear-color" | "send" | "delete";
      value: string | React.ReactNode;
    };

type KeyboardProps = {
  onKeyInput: (val: KeyInput) => void;
  clueData: Record<
    string,
    { present?: boolean; possiblePositions: Set<number> }
  >;
  keyColors: Record<string, "spy-says-no" | "spy-says-yes">;
  setKeyColors: React.Dispatch<
    React.SetStateAction<Record<string, "spy-says-no" | "spy-says-yes">>
  >;
};

export default function Keyboard({
  onKeyInput,
  clueData,
  keyColors,
  setKeyColors,
}: KeyboardProps) {
  const [colorMode, setColorMode] = useState<
    "spySaysNo" | "spySaysYes" | "clear" | null
  >(null);

  const characters: KeyInput[] = [
    ...["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
      (v) =>
        ({
          type: "character",
          value: v,
        } as KeyInput)
    ),
    { type: "character", value: "x" } as KeyInput,
    { type: "character", value: "y" } as KeyInput,
  ];

  const actions: KeyInput[] = [
    { type: "action", action: "delete", value: "DEL" },
    { type: "action", action: "send", value: "SEND" },
  ];

  const colorActions: KeyInput[] = [
    {
      type: "action",
      action: "spySaysNo",
      value: (
        <img src="/src/assets/red-brush-128.png" alt="Mark number as absent" />
      ),
    },
    {
      type: "action",
      action: "spySaysYes",
      value: (
        <img
          src="/src/assets/green-brush-128.png"
          alt="Mark number as present"
        />
      ),
    },
    {
      type: "action",
      action: "clear-color",
      value: <img src="/src/assets/eraser-128.png" alt="Clear color" />,
    },
  ];

  const getCursorClass = () => {
    if (!colorMode) return "";
    if (colorMode === "clear") return "cursor-eraser";
    if (colorMode === "spySaysYes") return "cursor-spy-says-yes";
    if (colorMode === "spySaysNo") return "cursor-spy-says-no";
    return "";
  };

  interface KeyButtonProps {
    keyInput: KeyInput;
    onKeyInput: (input: KeyInput) => void;
  }

  const KeyButton: React.FC<KeyButtonProps> = ({ keyInput, onKeyInput }) => {
    const handleClick = () => {
      if (keyInput.type === "character" && colorMode !== null) {
        setKeyColors((prev) => {
          const newColors = { ...prev };
          if (colorMode === "clear") {
            delete newColors[String(keyInput.value)];
          } else {
            newColors[String(keyInput.value)] =
              colorMode === "spySaysYes" ? "spy-says-yes" : "spy-says-no";
          }
          return newColors;
        });
        setColorMode(null);
      } else {
        if (keyInput.type === "action") {
          if (keyInput.action === "spySaysNo") {
            setColorMode(colorMode === "spySaysNo" ? null : "spySaysNo");
            return;
          }
          if (keyInput.action === "spySaysYes") {
            setColorMode(colorMode === "spySaysYes" ? null : "spySaysYes");
            return;
          }
          if (keyInput.action === "clear-color") {
            setColorMode(colorMode === "clear" ? null : "clear");
            return;
          }
        }
        onKeyInput(keyInput);
      }
    };

    const value = keyInput.value;
    const isPresent =
      typeof value === "string" ? clueData[value]?.present : undefined;
    const colorClass =
      keyInput.type === "character" && keyColors[String(value)]
        ? keyColors[String(value)]
        : "";

    const isActive =
      keyInput.type === "action" &&
      ((keyInput.action === "spySaysNo" && colorMode === "spySaysNo") ||
        (keyInput.action === "spySaysYes" && colorMode === "spySaysYes") ||
        (keyInput.action === "clear-color" && colorMode === "clear"));

    return (
      <button
        className={`key-button ${colorClass} ${
          isPresent === true ? "present" : isPresent === false ? "absent" : ""
        } ${isActive ? "active" : ""}`}
        onClick={handleClick}
        id={
          keyInput.action === "send"
            ? "send-button"
            : keyInput.action === "delete"
            ? "delete-button"
            : ""
        }
      >
        {renderIcon(keyInput.value)}
      </button>
    );
  };

  return (
    <div id="keyboard" className={getCursorClass()}>
      {characters.map((k, i) => (
        <KeyButton key={i} keyInput={k} onKeyInput={onKeyInput} />
      ))}
      {colorActions.map((key, i) => (
        <KeyButton key={`color-${i}`} keyInput={key} onKeyInput={onKeyInput} />
      ))}
      {actions.map((key, i) => (
        <KeyButton key={`action-${i}`} keyInput={key} onKeyInput={onKeyInput} />
      ))}
    </div>
  );
}
