import React, { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import Avatar from "./GameCreate/Avatars";
import Difficulty from "./GameCreate/Difficulty";

// Actualizamos la interfaz Player para incluir el avatar.
export interface Player {
  name: string;
  avatar: "she" | "he" | "they";
  difficulty: string; // Se almacena el nivel de dificultad con el que jugó
  number_of_games: number;
}

export function managePlayer(
  playerName: string,
  difficulty: string,
  avatar: "she" | "he" | "they"
): void {
  const savedPlayers = localStorage.getItem("players");
  const players: Player[] = savedPlayers ? JSON.parse(savedPlayers) : [];
  const index = players.findIndex((p) => p.name === playerName);

  if (index === -1) {
    // Se guarda el jugador con el nivel de dificultad y avatar seleccionado
    players.push({
      name: playerName,
      difficulty,
      avatar,
      number_of_games: 1,
    });
  } else {
    players[index].number_of_games += 1;
    // Actualizamos la dificultad y el avatar (podrían cambiar a cada partida)
    players[index].difficulty = difficulty;
    players[index].avatar = avatar;
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const active = getActivePlayerName();
    if (active) {
      setPlayerName(active);
      const p = getPlayerByName(active);
      if (p) {
        setSelectedAvatar(p.avatar);
        setSelectedDifficulty(p.difficulty);
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
      });
      onGameCreated(res.data);
      managePlayer(playerName, selectedDifficulty, selectedAvatar);
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
