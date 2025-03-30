import React, { useState } from "react";
import axios from "axios";

type TileProps = {
  gameId?: string;
  children?: React.ReactNode;
  attemptIndex?: number;
  tileIndex?: number;
  onClick?: () => void;
};

const Tile: React.FC<TileProps> = ({
  gameId,
  children,
  attemptIndex,
  tileIndex,
}) => {
  const [cssClasses, setCssClasses] = useState<string>("tile result");

  const handleClueRequest = async () => {
    // Only process clue requests for symbol tiles with valid indices
    if (!gameId || attemptIndex === undefined || tileIndex === undefined) {
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/games/${gameId}/clue`,
        { params: { attemptIndex, tileIndex } }
      );
      const clue = response.data.clue;
      setCssClasses(`${cssClasses} ${clue}`);
    } catch (err) {
      console.error("Error fetching clue", err);
    }
  };

  // Determine which click handler to use
  const handleClick = () => {
    handleClueRequest();
  };

  return (
    <div className={cssClasses} onClick={handleClick}>
      {children}
    </div>
  );
};

export default Tile;
