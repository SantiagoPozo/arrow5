// frontend/src/components/CreateGame.tsx
import React, { useState, FormEvent, useEffect } from "react";
import spyLogo from "./../assets/spy.png";
import axios from "axios";

// Utility functions for managing player data in localStorage

/**
 * Check if player exists in localStorage, add if not, and set as active player
 */
export function managePlayer(playerName: string): void {
  // Get existing players from localStorage or initialize empty array
  const savedPlayers = localStorage.getItem("players");
  const players: string[] = savedPlayers ? JSON.parse(savedPlayers) : [];

  // Check if player exists
  if (!players.includes(playerName)) {
    // Add new player
    players.push(playerName);
    // Save updated list
    localStorage.setItem("players", JSON.stringify(players));
  }

  // Set as active player
  localStorage.setItem("activePlayer", playerName);
}

/**
 * Get list of saved players
 */
export function getSavedPlayers(): string[] {
  const savedPlayers = localStorage.getItem("players");
  return savedPlayers ? JSON.parse(savedPlayers) : [];
}

/**
 * Get active player (last player who played)
 */
export function getActivePlayer(): string | null {
  return localStorage.getItem("activePlayer");
}

type CreateGameProps = {
  onGameCreated: (id: string) => void;
};

const CreateGame: React.FC<CreateGameProps> = ({ onGameCreated }) => {
  const [playerName, setPlayerName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Add useEffect to check for active player when component mounts
  useEffect(() => {
    const activePlayer = getActivePlayer();
    if (activePlayer && activePlayer.trim() !== "") {
      setPlayerName(activePlayer);
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
      });
      const newId = response.data.id;
      onGameCreated(newId);
      console.log("Game created successfully:", response.data);
      managePlayer(playerName);
    } catch (error) {
      console.error("Failed to create game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>
        Arr👁w Code <br /> A Spy Game
      </h1>
      <form onSubmit={handleCreateGame}>
        <div>
          <img src={spyLogo} className="logo" alt="Spy logo" />
          <label htmlFor="playerName">Player Name </label>
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
            autoFocus
          />
          <button type="submit" disabled={isLoading || !playerName.trim()}>
            {isLoading ? "Creating..." : "Create Game"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGame;
