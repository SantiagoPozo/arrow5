import React, { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import Avatar from "./GameCreate/Avatars";
import Difficulty from "./GameCreate/Difficulty";
import Mode from "./GameCreate/Mode";

// Actualizamos la interfaz Player para incluir obfuscation
export interface Player {
  name: string;
  avatar: "she" | "he" | "they";
  difficulty: string;
  obfuscation: boolean; // Añadido campo para obfuscation
  number_of_games: number;
}

export function managePlayer(
  playerName: string,
  difficulty: string,
  avatar: "she" | "he" | "they",
  obfuscation: boolean // Añadido parámetro para obfuscation
): void {
  const savedPlayers = localStorage.getItem("players");
  const players: Player[] = savedPlayers ? JSON.parse(savedPlayers) : [];
  const index = players.findIndex((p) => p.name === playerName);

  if (index === -1) {
    players.push({
      name: playerName,
      difficulty,
      avatar,
      obfuscation,
      number_of_games: 1,
    });
  } else {
    players[index].number_of_games += 1;
    // Actualizamos todos los datos que podrían cambiar
    players[index].difficulty = difficulty;
    players[index].avatar = avatar;
    players[index].obfuscation = obfuscation; // Actualizamos la preferencia de obfuscación
  }
  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("activePlayer", playerName);
}

export function getPlayerByName(playerName: string): Player | null {
  const savedPlayers = localStorage.getItem("players");
  const players: Player[] = savedPlayers ? JSON.parse(savedPlayers) : [];
  const player = players.find((p) => p.name === playerName);
  return player || null;
}

export function getActivePlayerName(): string | null {
  return localStorage.getItem("activePlayer");
}

type CreateGameProps = {
  onGameCreated: (id: string) => void;
};

const CreateGame: React.FC<CreateGameProps> = ({ onGameCreated }) => {
  const [playerName, setPlayerName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<"she" | "he" | "they">(
    "she"
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState("n");
  const [obfuscation, setObfuscation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const active = getActivePlayerName();
    if (active) {
      setPlayerName(active);
      const p = getPlayerByName(active);
      if (p) {
        setSelectedAvatar(p.avatar);
        setSelectedDifficulty(p.difficulty);
        // Recuperamos la preferencia de obfuscación si existe
        if (p.obfuscation !== undefined) {
          setObfuscation(p.obfuscation);
        }
      }
    }
  }, []);

  const handleCreateGame = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!playerName.trim()) return;
    setIsLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/games", {
        playerName,
        difficulty: selectedDifficulty,
        obfuscation: obfuscation,
      });
      onGameCreated(res.data);
      // Incluimos obfuscation en el guardado
      managePlayer(playerName, selectedDifficulty, selectedAvatar, obfuscation);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
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
        <button type="submit" disabled={isLoading || !playerName.trim()}>
          {isLoading ? "Creating..." : "Create Game"}
        </button>
      </form>
    </div>
  );
};

export default CreateGame;
