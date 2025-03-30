import React from "react";
import axios from "axios";
import { getSavedPlayers, managePlayer } from "../utils/playerStorage";

interface LastPlayersProps {
  onPlayerSelected: (playerId: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LastPlayers: React.FC<LastPlayersProps> = ({
  onPlayerSelected,
  isLoading,
  setIsLoading,
}) => {
  const players = getSavedPlayers().slice(0, 5); // Get up to 5 players

  const createGameForPlayer = async (playerName: string) => {
    setIsLoading(true);
    try {
      const url = "http://127.0.0.1:8000/games";
      const response = await axios.post(url, {
        playerName,
      });
      const newId = response.data.id;
      managePlayer(playerName); // Set as active player
      onPlayerSelected(newId);
    } catch (error) {
      console.error("Failed to create game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (players.length === 0) {
    return null;
  }

  return (
    <div className="last-players">
      <h3>Recent Players</h3>
      <div className="player-buttons">
        {players.map((player, index) => (
          <button
            key={index}
            onClick={() => createGameForPlayer(player)}
            disabled={isLoading}
          >
            {player}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LastPlayers;
