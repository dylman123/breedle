import { Breed } from "./breeds";
import { Guess } from "./guess";

export function getResultEmoji(guess: Guess, targetBreed: Breed) {
  return guess.code === targetBreed.code ? "🦴" : "💩";
}

export function generateDogCharacters(theme: "light" | "dark"): string[] {
  const characters = new Array<string>(5);
  characters.fill("🐶", 0, 5);
  return characters;
}

export function isNameCorrect(guess?: Guess, target?: Breed) {
  if (!guess || !target) {
    return false;
  } else {
    return guess.name === target.name;
  }
}

export function isGroupCorrect(guess?: Guess, target?: Breed) {
  if (!guess || !target) {
    return false;
  } else {
    return guess.group === target.group;
  }
}

export function isOriginCorrect(
  guessOrigin?: string,
  targetOrigins?: readonly string[]
) {
  if (!guessOrigin || !targetOrigins) {
    return false;
  } else {
    return targetOrigins.includes(guessOrigin);
  }
}

export function isSizeCorrect(
  guessSize?: number,
  targetSizes?: readonly number[]
) {
  if (!guessSize || !targetSizes) {
    return false;
  } else {
    return targetSizes.includes(guessSize);
  }
}
