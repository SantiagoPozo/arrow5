import React from "react";

export interface KeyInput {
  type: "character" | "action";
  value?: string;
  action?: "delete" | "send";
}

interface KeyboardProps {
  onKeyInput: (input: KeyInput) => void;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyInput }) => {
  // Keys for characters remain; for actions, use distinct identifiers.
  const firstRow: KeyInput[] = [
    { type: "character", value: "0" },
    { type: "character", value: "1" },
    { type: "character", value: "2" },
    { type: "character", value: "3" },
    { type: "character", value: "4" },
    { type: "character", value: "5" },
    { type: "character", value: "6" },
  ];
  const secondRow: KeyInput[] = [
    { type: "character", value: "7" },
    { type: "character", value: "8" },
    { type: "character", value: "9" },
    { type: "character", value: "x" },
    { type: "character", value: "y" },
    { type: "action", action: "delete", value: "␡" },
    { type: "action", action: "send", value: "→" },
  ];

  interface KeyButtonProps {
    keyInput: KeyInput;
    onKeyInput: (input: KeyInput) => void;
  }

  const KeyButton: React.FC<KeyButtonProps> = ({ keyInput, onKeyInput }) => {
    const handleClick = () => {
      onKeyInput(keyInput);
    };

    const label = keyInput.value;

    return (
      <button className="key-button" onClick={handleClick}>
        {label}
      </button>
    );
  };

  return (
    <div id="keyboard">
      <div className="row">
        {firstRow.map((key, i) => (
          <KeyButton key={i} keyInput={key} onKeyInput={onKeyInput} />
        ))}
      </div>
      <div className="row">
        {secondRow.map((key, i) => (
          <KeyButton key={i} keyInput={key} onKeyInput={onKeyInput} />
        ))}
      </div>
    </div>
  );
};

export default Keyboard;
