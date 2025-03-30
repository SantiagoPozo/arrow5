import React from "react";

type GameOverProps = {
  gameId: string;
  attempts: string[];
  responses: number[];
  // Optional callback to restart the game or navigate to another view
  onRestart?: () => void;
};

const GameOver: React.FC<GameOverProps> = ({
  gameId,
  attempts,
  responses,
  onRestart,
}) => {
  return (
    <div>
      <h2>Game Over</h2>
      <p>The game with ID {gameId} has finished.</p>
      <h3>Summary of Attempts</h3>
      <ul>
        {attempts.map((attempt, index) => (
          <li key={index}>
            Attempt: {attempt} - Response: {responses[index]}
          </li>
        ))}
      </ul>
      {onRestart && <button onClick={onRestart}>Restart Game</button>}
    </div>
  );
};

export default GameOver;
