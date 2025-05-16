export interface AttemptData {
  attempts: string[];
  responses: string[];
  clues?: Record<string, { result: string }>;
  solved?: boolean;
}

export interface KeyInput {
  type: "character" | "action";
  value?: string | React.ReactNode;
  // Actualizamos los tipos de acción
  action?: "delete" | "send" | "spySaysNo" | "spySaysYes" | "clear-color";
}

export interface ClueData {
  [key: string]: {
    present?: boolean;
    possiblePositions: Set<number>;
  };
}

export interface InputAttemptProps {
  attempt: string;
  setAttempt: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (attempt: string) => void;
}
