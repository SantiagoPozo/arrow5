import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClueData } from "../types";

type TileProps = {
  gameId?: string;
  children?: React.ReactNode;
  attemptIndex?: number;
  tileIndex?: number;
  setError?: (error: string) => void;
  setClueData: React.Dispatch<React.SetStateAction<ClueData>>;
  clueData: ClueData;
  attempt?: string;
  keyColor?: "spy-says-no" | "spy-says-yes";
  updateKeyboardState?: (
    key: string,
    state: "spy-says-yes" | "spy-says-no"
  ) => void;
};

const Tile: React.FC<TileProps> = ({
  gameId,
  children,
  attemptIndex,
  tileIndex,
  setError,
  setClueData,
  clueData,
  attempt,
  keyColor,
  updateKeyboardState,
}) => {
  const [cssClasses, setCssClasses] = useState<string>("result-tile tile");
  const character = children ? String(children) : "";

  // Update CSS classes when clueData changes for this digit
  useEffect(() => {
    if (character && clueData[character]) {
      const isPresent = clueData[character].present;
      if (isPresent === true && !cssClasses.includes("present")) {
        setCssClasses((prev) => prev + " present");
      } else if (isPresent === false && !cssClasses.includes("absent")) {
        setCssClasses((prev) => prev + " absent");
      }
    }
  }, [clueData, character]);

  // Update CSS classes when keyColor changes
  useEffect(() => {
    const baseClasses = cssClasses
      .replace(/(spy-says-no|spy-says-yes)/g, "")
      .trim();
    setCssClasses(keyColor ? `${baseClasses} ${keyColor}` : baseClasses);
  }, [keyColor]);

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
      setCssClasses(
        `${cssClasses} clue-required ${clue} ${
          clue === "left" || clue === "right" || clue === "steady"
            ? "present"
            : ""
        }`
      );
      handleClueReceived({ attemptIndex, tileIndex, clue });
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
      const newDigitClue = { ...prev };
      if (!newDigitClue[digit]) {
        newDigitClue[digit] = {
          possiblePositions: new Set([0, 1, 2, 3, 4]),
        };
      }

      if (data.clue === "absent") {
        newDigitClue[digit].present = false;
        return newDigitClue;
      }

      newDigitClue[digit].present = true;
      if (data.clue === "steady") {
        newDigitClue[digit].possiblePositions = new Set([data.tileIndex]);
      } else if (data.clue === "right") {
        newDigitClue[digit].possiblePositions = new Set(
          Array.from(newDigitClue[digit].possiblePositions).filter(
            (position) => position > data.tileIndex
          )
        );
      } else if (data.clue === "left") {
        newDigitClue[digit].possiblePositions = new Set(
          Array.from(newDigitClue[digit].possiblePositions).filter(
            (position) => position < data.tileIndex
          )
        );
      }
      return newDigitClue;
    });
    console.log("Clue processed:", data);
  };

  return (
    <div className={cssClasses} onClick={handleClueRequest}>
      {children}
    </div>
  );
};

export default Tile;
