export interface Guess {
  name: string;
  code: string;
  group: number;
  origin: readonly string[];
  size: readonly number[];
  correct: boolean;
}

function selectStorageItem(advancedMode: boolean | null): string {
  switch (advancedMode) {
    case true:
      return "guesses-hard-mode";
    case false:
      return "guesses-easy-mode";
    default:
      return "guesses";
  }
}

export function loadAllGuesses(
  advancedMode: boolean | null
): Record<string, Guess[]> {
  const storedGuesses = localStorage.getItem(selectStorageItem(advancedMode));
  return storedGuesses != null ? JSON.parse(storedGuesses) : {};
}

export function saveGuesses(
  dayString: string,
  advancedMode: boolean,
  guesses: Guess[]
): void {
  const allGuesses = loadAllGuesses(advancedMode);
  localStorage.setItem(
    selectStorageItem(advancedMode),
    JSON.stringify({
      ...allGuesses,
      [dayString]: guesses,
    })
  );
}
