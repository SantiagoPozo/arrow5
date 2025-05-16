import React, { useEffect, useRef, useState } from "react";
import InputTile from "./InputTile";
import { KeyInput } from "../types";

interface InputTilesProps {
  keyboardInput: KeyInput | null;
  setKeyboardInput: (input: KeyInput | null) => void;
  setError: React.Dispatch<React.SetStateAction<string>>;
  onComplete?: (attempt: string) => Promise<boolean>;
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

  useEffect(() => {
    const handlePhysicalKey = (e: KeyboardEvent) => {
      // Si se presiona "Enter", se intenta enviar el intento.
      if (e.key === "Enter") {
        handleSendAsync();
        return;
      }

      // Si se presiona la barra espaciadora, se avanza al siguiente tile.
      if (e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        const nextIndex = (activeIndex + 1) % 5;
        setActiveIndex(nextIndex);
        inputRefs.current[nextIndex]?.focus();
        return;
      }

      if (e.key === "Backspace") {
        handleDelete();
        return;
      }

      if (e.key === "ArrowLeft") {
        const prevIndex = (activeIndex + 4) % 5;
        setActiveIndex(prevIndex);
        inputRefs.current[prevIndex]?.focus();
        return;
      }

      // Permitir únicamente dígitos, 'x' y 'y' (ignora otras teclas)
      if (/^[0-9xy]$/i.test(e.key)) {
        setTiles((prev) => {
          const newTiles = [...prev];
          newTiles[activeIndex] = e.key;
          return newTiles;
        });

        const nextIndex = (activeIndex + 1) % 5;
        setActiveIndex(nextIndex);
        inputRefs.current[nextIndex]?.focus();
      }
    };

    window.addEventListener("keydown", handlePhysicalKey);
    return () => {
      window.removeEventListener("keydown", handlePhysicalKey);
    };
  }, [activeIndex, setTiles, inputRefs]);

  const handleDelete = () => {
    setTiles((prev) => {
      const newTiles = [...prev];
      if (newTiles[activeIndex] !== "") {
        newTiles[activeIndex] = "";
      }

      setActiveIndex((activeIndex + 4) % 5);
      inputRefs.current[(activeIndex + 4) % 5]?.focus();
      return newTiles;
    });
  };

  const handleSendAsync = async () => {
    const attemptStr = tiles.join("");
    if (attemptStr.length === 5 && onComplete) {
      const success = await onComplete(attemptStr);
      if (success) {
        setTiles(["", "", "", "", ""]);
        setActiveIndex(0);
        inputRefs.current[0]?.focus();
      }
    }
  };

  useEffect(() => {
    if (keyboardInput) {
      if (keyboardInput.type === "action") {
        if (keyboardInput.action === "delete") {
          handleDelete();
          setKeyboardInput(null);
        } else if (keyboardInput.action === "send") {
          handleSendAsync();
          setKeyboardInput(null);
        }
      } else if (keyboardInput.type === "character") {
        setTiles((prev) => {
          const newTiles = [...prev];
          newTiles[activeIndex] = String(keyboardInput.value); // Ensure it's a string
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
