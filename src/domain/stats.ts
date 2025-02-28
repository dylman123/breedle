import { DateTime } from "luxon";
import { loadAllGuesses } from "./guess";

export interface StatsData {
  currentStreak: number;
  maxStreak: number;
  played: number;
  winRatio: number;
  guessDistribution: Record<1 | 2 | 3 | 4 | 5 | 6, number>;
  averageBestDistance: number;
}

export function getStatsData(): StatsData {
  const easyModeGuesses = loadAllGuesses(false);
  const advancedModeGuesses = loadAllGuesses(true);
  const noModeGuesses = loadAllGuesses(null); // to maintain guesses before 'advancedMode' was developed

  const easyModeGuessesEntries = Object.entries(easyModeGuesses);
  const advancedModeGuessesEntries = Object.entries(advancedModeGuesses);
  const noModeGuessesEntries = Object.entries(noModeGuesses);
  const allGuessesEntries = noModeGuessesEntries
    .concat(easyModeGuessesEntries)
    .concat(advancedModeGuessesEntries);

  const played = allGuessesEntries.length;

  const guessDistribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  };

  let currentStreak = 0;
  let maxStreak = 0;
  let previousDate: DateTime | undefined;
  const bestDistanceSum = 0;
  for (const [dayString, guesses] of allGuessesEntries) {
    const currentDate = DateTime.fromFormat(dayString, "yyyy-MM-dd");
    const winIndex = guesses.findIndex((guess) => guess.correct === true);
    const won = winIndex >= 0;
    if (won) {
      const tryCount = (winIndex + 1) as 1 | 2 | 3 | 4 | 5 | 6;
      guessDistribution[tryCount]++;

      if (
        previousDate == null ||
        previousDate.plus({ days: 1 }).hasSame(currentDate, "day")
      ) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 0;
    }

    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
    }
    previousDate = currentDate;
  }

  const winCount = Object.values(guessDistribution).reduce(
    (total, tries) => total + tries
  );

  return {
    currentStreak: currentStreak,
    maxStreak: maxStreak,
    played,
    winRatio: winCount / (played || 1),
    guessDistribution: guessDistribution,
    averageBestDistance: bestDistanceSum / (played || 1),
  };
}
