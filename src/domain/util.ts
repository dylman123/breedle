import { Breed } from "./breeds";
import { Guess } from "./guess";
import { heights } from "./sizes.mapping";

const MAX_DISTANCE_ON_EARTH = 20_000_000;

export type Direction =
  | "S"
  | "W"
  | "NNE"
  | "NE"
  | "ENE"
  | "E"
  | "ESE"
  | "SE"
  | "SSE"
  | "SSW"
  | "SW"
  | "WSW"
  | "WNW"
  | "NW"
  | "NNW"
  | "N";

const DIRECTION_ARROWS: Record<Direction, string> = {
  N: "⬆️",
  NNE: "↗️",
  NE: "↗️",
  ENE: "↗️",
  E: "➡️",
  ESE: "↘️",
  SE: "↘️",
  SSE: "↘️",
  S: "⬇️",
  SSW: "↙️",
  SW: "↙️",
  WSW: "↙️",
  W: "⬅️",
  WNW: "↖️",
  NW: "↖️",
  NNW: "↖️",
};

export function getResultEmoji(guess: Guess, targetBreed: Breed) {
  return guess.code === targetBreed.code ? "🦴" : "💩";
}

export function getDirectionEmoji(guess: Guess) {
  return guess.distance === 0 ? "🎉" : DIRECTION_ARROWS[guess.direction];
}

export function computeProximityPercent(distance: number): number {
  const proximity = Math.max(MAX_DISTANCE_ON_EARTH - distance, 0);
  return Math.floor((proximity / MAX_DISTANCE_ON_EARTH) * 100);
}

export function generateSquareCharacters(
  proximity: number,
  theme: "light" | "dark"
): string[] {
  const characters = new Array<string>(5);
  const greenSquareCount = Math.floor(proximity / 20);
  const yellowSquareCount = proximity - greenSquareCount * 20 >= 10 ? 1 : 0;

  characters.fill("🟩", 0, greenSquareCount);
  characters.fill("🟨", greenSquareCount, greenSquareCount + yellowSquareCount);
  characters.fill(
    theme === "light" ? "⬜" : "⬛",
    greenSquareCount + yellowSquareCount
  );

  return characters;
}

export function formatDistance(
  distanceInMeters: number,
  distanceUnit: "km" | "miles"
) {
  const distanceInKm = distanceInMeters / 1000;

  return distanceUnit === "km"
    ? `${Math.round(distanceInKm).toLocaleString()}km`
    : `${Math.round(distanceInKm * 0.621371).toLocaleString()}mi`;
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

export function calculateSizeMatch(guess?: Guess, target?: Breed) {
  if (!guess || !target) {
    return false;
  } else {
    const minG = Math.min(...heights[Math.min(...guess.size)]);
    const maxG = Math.max(...heights[Math.max(...guess.size)]);
    const minT = Math.min(...heights[Math.min(...target.size)]);
    const maxT = Math.max(...heights[Math.max(...target.size)]);

    const overlap = minG < minT ? maxG - minT + 1 : maxT - minG + 1;
    const lengthT = maxT - minT;
    const percentOverlap = overlap / lengthT;

    console.log({
      minG,
      maxG,
      minT,
      maxT,
      percentOverlap,
      overlap,
      lengthT,
    });

    return percentOverlap;
  }
}
