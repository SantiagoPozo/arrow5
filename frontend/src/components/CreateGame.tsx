// frontend/src/components/CreateGame.tsx
import React, { useState, FormEvent, useEffect } from "react";
import sheSpy from "./../assets/she.png";
import heSpy from "./../assets/he.png";
import theySpy from "./../assets/they.png";
import axios from "axios";

// Removemos el concepto de gender del envío al servidor
export interface Player {
  name: string;
  difficulty: string; // Nuevo: se almacena el nivel de dificultad con el que jugó
  number_of_games: number;
}

export function managePlayer(playerName: string, difficulty: string): void {
  const savedPlayers = localStorage.getItem("players");
  const players: Player[] = savedPlayers ? JSON.parse(savedPlayers) : [];
  const index = players.findIndex((p) => p.name === playerName);

  if (index === -1) {
    // Se guarda el jugador con el nivel de dificultad seleccionado
    players.push({
      name: playerName,
      difficulty,
      number_of_games: 1,
    });
  } else {
    players[index].number_of_games += 1;
    // Actualizamos el nivel de dificultad con el que jugó (podría cambiar en cada partida)
    players[index].difficulty = difficulty;
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
  const [playerName, setPlayerName] = useState<string>("");
  const [selectedAvatar, setSelectedAvatar] = useState<"she" | "he" | "they">(
    "she"
  );

  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("n");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const activeName = getActivePlayerName();
    if (activeName && activeName.trim() !== "") {
      setPlayerName(activeName);
      const savedPlayer = getPlayerByName(activeName);
      if (savedPlayer) {
        setSelectedDifficulty(savedPlayer.difficulty);
      }
    }
  }, []);

  const handleCreateGame = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!playerName.trim()) return;

    setIsLoading(true);
    try {
      const url = "http://127.0.0.1:8000/games";
      const response = await axios.post(url, {
        playerName,
        difficulty: selectedDifficulty,
      });
      const newId = response.data;
      onGameCreated(newId);
      console.log("Game created successfully:", newId);
      managePlayer(playerName, selectedDifficulty);
      console.log("Selected difficulty:", selectedDifficulty);
    } catch (error) {
      console.error("Failed to create game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="create-game">
      <h1>
        Arr👁w Code <br /> A Spies Game
      </h1>
      <form onSubmit={handleCreateGame}>
        <div id="avatars-wrapper">
          <div
            className={`avatar she ${
              selectedAvatar === "she" ? "selected" : ""
            }`}
            onClick={() => setSelectedAvatar("she")}
          >
            <img src={sheSpy} className="avatar" alt="She Spy avatar" />
          </div>
          <div
            className={`avatar he ${selectedAvatar === "he" ? "selected" : ""}`}
            onClick={() => setSelectedAvatar("he")}
          >
            <img src={heSpy} className="avatar" alt="He Spy avatar" />
          </div>
          <div
            className={`avatar they ${
              selectedAvatar === "they" ? "selected" : ""
            }`}
            onClick={() => setSelectedAvatar("they")}
          >
            <img src={theySpy} className="avatar" alt="They Spy avatar" />
          </div>
        </div>

        {/* New difficulty menu */}
        <div id="difficulty-wrapper">
          <p>Level</p>
          <div className="radio-options">
            <div className="radio-option">
              <div className="radio-input-wrapper">
                <input
                  type="radio"
                  id="phantom-mode"
                  name="difficulty"
                  value="0"
                  checked={selectedDifficulty === "0"}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                />
              </div>
              <label htmlFor="phantom-mode">
                <strong>Unforgiving Phantom Mode</strong>
                <div className="tooltip">
                  <p className="description">Clues cannot be requested.</p>
                  <p className="flavor">
                    You are in danger, they know who you are.
                  </p>
                </div>
              </label>
            </div>
            <div className="radio-option">
              <div className="radio-input-wrapper">
                <input
                  type="radio"
                  id="shadow-mode"
                  name="difficulty"
                  value="1"
                  checked={selectedDifficulty === "1"}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                />
              </div>
              <label htmlFor="shadow-mode">
                <strong>Single‑Clue Shadow Mode</strong>
                <div className="tooltip">
                  <p className="description">Only one clue per game.</p>
                  <p className="flavor">
                    They know there is an infiltrator. They are paranoid.
                  </p>
                </div>
              </label>
            </div>
            <div className="radio-option">
              <div className="radio-input-wrapper">
                <input
                  type="radio"
                  id="tactical-mode"
                  name="difficulty"
                  value="n"
                  checked={selectedDifficulty === "n"}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                />
              </div>
              <label htmlFor="tactical-mode">
                <strong>Tactical Advance Mode</strong>
                <div className="tooltip">
                  <p className="description">One clue per attempt.</p>
                  <p className="flavor">
                    They trust you, but sometimes you feel someone is watching
                    you.
                  </p>
                </div>
              </label>
            </div>
            <div className="radio-option">
              <div className="radio-input-wrapper">
                <input
                  type="radio"
                  id="superior-mode"
                  name="difficulty"
                  value="5n"
                  checked={selectedDifficulty === "5n"}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                />
              </div>
              <label htmlFor="superior-mode">
                <strong>Intellectual and Technological Superiority</strong>
                <div className="tooltip">
                  <p className="description">
                    You can request as many clues as you want.
                  </p>
                  <p className="flavor">
                    Where did these cavemen come from? Not only do they trust
                    you, but they have no idea how powerful our technology is.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <input
          type="text"
          id="playerName"
          name="playerName"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreateGame();
            }
          }}
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
