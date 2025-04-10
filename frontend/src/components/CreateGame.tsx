// frontend/src/components/CreateGame.tsx
import React, { useState, FormEvent, useEffect } from "react";
import sheSpy from "./../assets/she.png";
import heSpy from "./../assets/he.png";
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
  const [selectedGenders, setSelectedGenders] = useState<{
    she: boolean;
    he: boolean;
  }>({
    she: false,
    he: false,
  });

  // Add useEffect to check for active player when component mounts
  useEffect(() => {
    const activePlayer = getActivePlayer();
    if (activePlayer && activePlayer.trim() !== "") {
      setPlayerName(activePlayer);
    }
  }, []);

  const toggleGender = (gender: "she" | "he") => {
    setSelectedGenders((prev) => ({
      ...prev,
      [gender]: !prev[gender],
    }));
  };

  const handleCreateGame = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!playerName.trim()) return;

    // Determine player gender based on selections
    let gender = "none";
    if (selectedGenders.she && selectedGenders.he) {
      gender = "both";
    } else if (selectedGenders.she) {
      gender = "she";
    } else if (selectedGenders.he) {
      gender = "he";
    }

    setIsLoading(true);
    try {
      const url = "http://127.0.0.1:8000/games";
      const response = await axios.post(url, {
        playerName,
        gender, // Changed from playerGender to gender to match backend model
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
    <div id="create-game">
      <h1>
        Arr👁w Code <br /> A Spies Game
      </h1>
      <form onSubmit={handleCreateGame}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            margin: "20px 0",
          }}
        >
          <div
            onClick={() => toggleGender("she")}
            style={{
              cursor: "pointer",
              padding: "8px",
              border: selectedGenders.she
                ? "3px solid #0088ff"
                : "3px solid transparent",
              borderRadius: "10px",
              opacity: selectedGenders.she ? 1 : 0.7,
              transition: "all 0.2s ease",
            }}
          >
            <img src={sheSpy} className="logo" alt="She Spy logo" />
          </div>
          <div
            onClick={() => toggleGender("he")}
            style={{
              cursor: "pointer",
              padding: "8px",
              border: selectedGenders.he
                ? "3px solid #0088ff"
                : "3px solid transparent",
              borderRadius: "10px",
              opacity: selectedGenders.he ? 1 : 0.7,
              transition: "all 0.2s ease",
            }}
          >
            <img src={heSpy} className="logo" alt="He Spy logo" />
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
