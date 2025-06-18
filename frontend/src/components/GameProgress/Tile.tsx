import React, { useEffect } from "react";
import axios from "axios";
import { AttemptData, ClueData } from "../types";

type TileProps = {
  gameId?: string;
  attemptIndex: number;
  tileIndex: number;
  setError?: (error: string) => void;
  setClueData: React.Dispatch<React.SetStateAction<ClueData>>;
  clueData: ClueData;
  attempt: string;
  setAttemptData: React.Dispatch<React.SetStateAction<AttemptData>>;
  attemptData: AttemptData; // Nuevo prop
  keyColor?: "spy-says-no" | "spy-says-yes";
  updateKeyboardState?: (
    key: string,
    state: "spy-says-yes" | "spy-says-no"
  ) => void;
  character: string;
  children: React.ReactNode;
};

const Tile: React.FC<TileProps> = ({
  gameId,
  attemptIndex,
  tileIndex,
  setError,
  setClueData,
  clueData,
  attempt,
  setAttemptData,
  attemptData,
  keyColor,
  updateKeyboardState,
  character,
  children: children,
}) => {
  useEffect(() => {
    localStorage.setItem("clueData", JSON.stringify(clueData));
    console.log("clueData updated:", clueData);
  }, [clueData]);

  let cssClasses = "result-tile tile";
  // Agregamos el valor de attemptData.requestedClues para este intento y tile.
  const charState = attemptData.requestedClues[attemptIndex][tileIndex];
  if (charState !== "") {
    cssClasses += ` clue-requested ${charState}`;
  }
  if (charState === "left" || charState === "right" || charState === "steady") {
    cssClasses += " present";
  }

  if (typeof character === "string") {
    if (
      clueData[character].present === false &&
      cssClasses.indexOf("absent") === -1
    ) {
      cssClasses += " absent";
    }
    if (
      clueData[character].present === true &&
      cssClasses.indexOf("present") === -1
    ) {
      cssClasses += " present";
    }
  }
  if (keyColor) {
    cssClasses += ` ${keyColor}`;
  }
  const handleClueRequest = async () => {
    if (!gameId || attemptIndex === undefined || tileIndex === undefined) {
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/games/${gameId}/clue`,
        { params: { attemptIndex, tileIndex } }
      );
      const clue = response.data.clue;
      console.log("Clue received:", clue);

      handleClueReceived({ attemptIndex, tileIndex, clue });
      setAttemptData((prev) => {
        const newRequestedClues = [...prev.requestedClues];
        newRequestedClues[attemptIndex][tileIndex] = clue;
        return { ...prev, requestedClues: newRequestedClues };
      });
    } catch (err) {
      console.error("Error fetching clue", err);
      const errorMsg =
        axios.isAxiosError(err) && err.response?.data?.detail
          ? err.response.data.detail
          : `Error fetching clue. Please try again later: ${err}`;
      setError && setError(errorMsg);
    }
  };

  const handleClueReceived = (data: {
    attemptIndex: number;
    tileIndex: number;
    clue: string;
  }): void => {
    if (!attempt) {
      return;
    }

    const digit = attempt.charAt(data.tileIndex);
    console.log("Digit:", digit);

    if (
      data.clue === "steady" ||
      data.clue === "left" ||
      data.clue === "right"
    ) {
      updateKeyboardState && updateKeyboardState(digit, "spy-says-yes");
    }

    setClueData((prev) => {
      const newClueData = { ...prev };
      if (!newClueData[digit]) {
        newClueData[digit] = {
          possiblePositions: [0, 1, 2, 3, 4],
        };
      }

      if (data.clue === "absent") {
        newClueData[digit].present = false;
        newClueData[digit].possiblePositions = [];
        return newClueData;
      }

      newClueData[digit].present = true;

      if (data.clue === "steady") {
        newClueData[digit].possiblePositions = [data.tileIndex];
      } else if (data.clue === "right") {
        newClueData[digit].possiblePositions = newClueData[
          digit
        ].possiblePositions.filter((position) => position > data.tileIndex);
      } else if (data.clue === "left") {
        newClueData[digit].possiblePositions = newClueData[
          digit
        ].possiblePositions.filter((position) => position < data.tileIndex);
      }
      return newClueData;
    });
    console.log("Clue processed:", data);
  };

  return (
    <div className={cssClasses.trim()} onClick={handleClueRequest}>
      {children}
    </div>
  );
};

export default Tile;
