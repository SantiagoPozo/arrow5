import React, { useEffect, useRef, useState } from "react";
import InputTile from "./InputTile";
import { KeyInput } from "./Keyboard";

interface InputTilesProps {
  keyboardInput: KeyInput | null;
  setKeyboardInput: (input: KeyInput | null) => void;
  onComplete?: (attempt: string) => void;
}

const InputTiles: React.FC<InputTilesProps> = ({
  keyboardInput,
  setKeyboardInput,
  onComplete,
}) => {
  const [tiles, setTiles] = useState<string[]>(["", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const inputRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDelete = () => {
    setTiles((prev) => {
      const newTiles = [...prev];
      if (newTiles[activeIndex] !== "") {
        newTiles[activeIndex] = "";
      } else if (activeIndex > 0) {
        newTiles[activeIndex - 1] = "";
        setActiveIndex(activeIndex - 1);
        inputRefs.current[activeIndex - 1]?.focus();
      }
      return newTiles;
    });
  };

  const handleSend = () => {
    const attemptStr = tiles.join("");
    if (attemptStr.length === 5 && onComplete) {
      onComplete(attemptStr);
    }
  };

  useEffect(() => {
    if (keyboardInput) {
      if (keyboardInput.type === "action") {
        if (keyboardInput.action === "delete") {
          handleDelete();
          setKeyboardInput(null);
        } else if (keyboardInput.action === "send") {
          handleSend();
          setTiles(["", "", "", "", ""]);
          setActiveIndex(0);
          inputRefs.current[0]?.focus();
          setKeyboardInput(null);
        }
      } else if (keyboardInput.type === "character") {
        setTiles((prev) => {
          const newTiles = [...prev];
          newTiles[activeIndex] = keyboardInput.value || "";
          return newTiles;
        });
        setKeyboardInput(null);
        if (activeIndex < 4) {
          const nextIndex = activeIndex + 1;
          setActiveIndex(nextIndex);
          inputRefs.current[nextIndex]?.focus();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboardInput]);

  const handleTileFocus = (index: number) => {
    setActiveIndex(index);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const next = (index + 1) % 5;
      setActiveIndex(next);
      inputRefs.current[next]?.focus();
    }
  };

  return (
    <div className="input-tiles">
      {tiles.map((value, index) => (
        <InputTile
          key={index}
          value={value}
          active={index === activeIndex}
          onFocus={() => handleTileFocus(index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
        />
      ))}
    </div>
  );
};

export default InputTiles;
