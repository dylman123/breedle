import { Breed } from "./breeds";
import { Guess } from "./guess";

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

export function isGroupCorrect(guess?: Guess, target?: Breed) {
  if (!guess || !target) {
    return false;
  } else {
    return guess.group === target.group;
  }
}

export function isOriginCorrect(guess?: string, target?: readonly string[]) {
  console.log({ guess, target });
  if (!guess || !target) {
    return false;
  } else {
    return target.includes(guess);
  }
}
