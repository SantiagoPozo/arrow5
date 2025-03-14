// CreateGame.tsx
import React, { useState } from "react";
import axios from "axios";

const CreateGame: React.FC = () => {
  const [gameId, setGameId] = useState<string>("");

  const handleCreateGame = async () => {
    try {
      // Call to backend endpoint to create a game
      const response = await axios.post("http://localhost:8000/games");
      setGameId(response.data.id);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={handleCreateGame}>Create Game</button>
      {gameId && <p>Game created with ID: {gameId}</p>}
    </div>
  );
};

export default CreateGame;
