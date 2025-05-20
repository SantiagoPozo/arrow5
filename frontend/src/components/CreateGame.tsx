import React, { FormEvent, useEffect } from "react";
import axios from "axios";
import Avatar from "./GameCreate/Avatars";
import Difficulty from "./GameCreate/Difficulty";
import Mode from "./GameCreate/Mode";

// Extiende el type de props para incluir los estados y sus setters
type CreateGameProps = {
  onGameCreated: (id: string) => void;
  playerName: string;
  setPlayerName: React.Dispatch<React.SetStateAction<string>>;
  selectedAvatar: "she" | "he" | "they";
  setSelectedAvatar: React.Dispatch<
    React.SetStateAction<"she" | "he" | "they">
  >;
  selectedDifficulty: string;
  setSelectedDifficulty: React.Dispatch<React.SetStateAction<string>>;
  obfuscation: boolean;
  setObfuscation: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateGame: React.FC<CreateGameProps> = ({
  onGameCreated,
  playerName,
  setPlayerName,
  selectedAvatar,
  setSelectedAvatar,
  selectedDifficulty,
  setSelectedDifficulty,
  obfuscation,
  setObfuscation,
}) => {
  useEffect(() => {
    const active = getActivePlayerName();
    if (active) {
      setPlayerName(active);
      const p = getPlayerByName(active);
      if (p) {
        setSelectedAvatar(p.avatar);
        setSelectedDifficulty(p.difficulty);
        if (p.obfuscation !== undefined) {
          setObfuscation(p.obfuscation);
        }
      }
    }
  }, [setPlayerName, setSelectedAvatar, setSelectedDifficulty, setObfuscation]);

  const handleCreateGame = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!playerName.trim()) return;
    try {
      const res = await axios.post("http://127.0.0.1:8000/games", {
        playerName,
        difficulty: selectedDifficulty,
        obfuscation: obfuscation,
      });
      onGameCreated(res.data);
      managePlayer(playerName, selectedDifficulty, selectedAvatar, obfuscation);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="create-game">
      <h1>Arr👁w Code</h1>
      <h2>A Spies Game of Deduction and Deception</h2>
      <form onSubmit={handleCreateGame}>
        <Avatar
          selectedAvatar={selectedAvatar}
          onSelectAvatar={setSelectedAvatar}
        />
        <Difficulty
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
        />
        <Mode obfuscation={obfuscation} setObfuscation={setObfuscation} />
        <input
          type="text"
          id="playerName"
          name="playerName"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
          autoFocus
        />
        <button type="submit" disabled={!playerName.trim()}>
          Create Game
        </button>
      </form>
    </div>
  );
};

export default CreateGame;
