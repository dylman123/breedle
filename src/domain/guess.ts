export interface Guess {
  name: string;
  code: string;
  group: number;
  origin: readonly string[];
  size: readonly number[];
  correct: boolean;
}

function selectStorageItem(easyMode: boolean): string {
  switch (easyMode) {
    case true:
      return "guesses-easy-mode";
    case false:
      return "guesses-hard-mode";
    default:
      return "guesses";
  }
}

export function loadAllGuesses(easyMode: boolean): Record<string, Guess[]> {
  const storedGuesses = localStorage.getItem(selectStorageItem(easyMode));
  return storedGuesses != null ? JSON.parse(storedGuesses) : {};
}

export function saveGuesses(
  dayString: string,
  easyMode: boolean,
  guesses: Guess[]
): void {
  const allGuesses = loadAllGuesses(easyMode);
  localStorage.setItem(
    selectStorageItem(easyMode),
    JSON.stringify({
      ...allGuesses,
      [dayString]: guesses,
    })
  );
}
