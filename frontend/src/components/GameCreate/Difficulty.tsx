import React from "react";

type DifficultyProps = {
  selectedDifficulty: string;
  setSelectedDifficulty: (value: string) => void;
};

const OPTIONS = [
  {
    id: "phantom-mode",
    label: "Unforgiving Phantom Mode",
    value: "0",
    description: "Clues cannot be requested.",
    flavor: "You are in danger, they know who you are.",
  },
  {
    id: "shadow-mode",
    label: "Single‑Clue Shadow Mode",
    value: "1",
    description: "Only one clue per game.",
    flavor: "They know there is an infiltrator. They are paranoid.",
  },
  {
    id: "tactical-mode",
    label: "Tactical Advance Mode",
    value: "n",
    description: "One clue per attempt.",
    flavor: "They trust you, but sometimes you feel someone is watching you.",
  },
  {
    id: "superior-mode",
    label: "Intellectual and Technological Superiority",
    value: "5n",
    description: "You can request as many clues as you want.",
    flavor:
      "Where did these cavemen come from? Not only do they trust you, but they have no idea how powerful our technology is.",
  },
];

const Difficulty: React.FC<DifficultyProps> = ({
  selectedDifficulty,
  setSelectedDifficulty,
}) => (
  <div id="difficulty-wrapper">
    <p>Level</p>
    <div className="radio-options">
      {OPTIONS.map(({ id, label, value, description, flavor }) => (
        <div className="radio-option" key={id}>
          <div className="radio-input-wrapper">
            <input
              type="radio"
              id={id}
              name="difficulty"
              value={value}
              checked={selectedDifficulty === value}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            />
          </div>
          <label htmlFor={id}>
            <strong>{label}</strong>
            <div className="tooltip">
              <p className="description">{description}</p>
              <p className="flavor">{flavor}</p>
            </div>
          </label>
        </div>
      ))}
    </div>
  </div>
);

export default Difficulty;
