import { Direction } from "./util";

export interface Guess {
  name: string;
  distance: number;
  direction: Direction;
  code: string;
  group: number;
  origin: readonly string[];
  // size: readonly number[];
}

export function loadAllGuesses(): Record<string, Guess[]> {
  const storedGuesses = localStorage.getItem("guesses");
  return storedGuesses != null ? JSON.parse(storedGuesses) : {};
}

export function saveGuesses(dayString: string, guesses: Guess[]): void {
  const allGuesses = loadAllGuesses();
  localStorage.setItem(
    "guesses",
    JSON.stringify({
      ...allGuesses,
      [dayString]: guesses,
    })
  );
}
