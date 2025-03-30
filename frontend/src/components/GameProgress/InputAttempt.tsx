import React, { useState } from "react";

interface InputAttemptProps {
  attempt: string;
  setAttempt: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (attempt: string) => void;
}

const InputAttempt: React.FC<InputAttemptProps> = ({
  onSubmit,
  attempt,
  setAttempt,
}) => {
  const handleSubmit = () => {
    onSubmit(attempt);
    setAttempt("");
  };

  return (
    <div>
      <input
        id="attempt-input"
        type="text"
        placeholder="123xy"
        value={attempt}
        onChange={(e) => {
          const value = e.target.value;
          // Only allow digits, x, and y
          if (/^[0-9xy]*$/.test(value) && value.length <= 5) {
            setAttempt(value);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && attempt.length === 5) {
            handleSubmit();
          }
        }}
        maxLength={5}
        autoFocus
      />
      <button onClick={handleSubmit} disabled={attempt.length !== 5}>
        Try
      </button>
    </div>
  );
};

export default InputAttempt;
