import { DateTime, Interval } from "luxon";
import { useMemo } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  computeProximityPercent,
  generateSquareCharacters,
  getDirectionEmoji,
  getResultEmoji,
} from "../domain/geography";
import { Guess } from "../domain/guess";
import { Breed } from "../domain/breeds";
import React from "react";
import { SettingsData } from "../hooks/useSettings";

const START_DATE = DateTime.fromISO("2022-01-21");

interface ShareProps {
  guesses: Guess[];
  dayString: string;
  settingsData: SettingsData;
  hideImageMode: boolean;
  rotationMode: boolean;
  breed: Breed;
}

export function Share({
  guesses,
  dayString,
  settingsData,
  hideImageMode,
  rotationMode,
  breed,
}: ShareProps) {
  const { t } = useTranslation();
  const { theme } = settingsData;

  const shareText = useMemo(() => {
    const win = guesses[guesses.length - 1]?.distance === 0;
    const bestDistance = Math.min(...guesses.map(({ distance }) => distance));
    const guessCount = win ? guesses.length : "X";
    const dayCount = Math.floor(
      Interval.fromDateTimes(START_DATE, DateTime.fromISO(dayString)).length(
        "day"
      )
    );
    const difficultyModifierEmoji = hideImageMode
      ? " 🙈"
      : rotationMode
      ? " 🌀"
      : "";
    const bestPercent = `(${computeProximityPercent(
      bestDistance
    ).toString()}%)`;
    // const title = `#Breedle #${dayCount} ${guessCount}/6 ${bestPercent}${difficultyModifierEmoji}`;
    const title = `Breedle #${dayCount} ${guessCount}/6`;

    const guessString = guesses
      .map((guess) => {
        // const percent = computeProximityPercent(guess.distance);
        // const squares = generateSquareCharacters(percent, theme).join("");
        const result = getResultEmoji(guess, breed);
        return `${result}`;
      })
      .join("");

    return [title, guessString, "https://breedle.com.au"].join("\n");
  }, [dayString, guesses, hideImageMode, rotationMode, breed]);

  return (
    <CopyToClipboard
      text={shareText}
      onCopy={() => toast(t("copy"))}
      options={{
        format: "text/plain",
      }}
    >
      <button className="rounded font-bold border-2 p-1 uppercase bg-green-600 hover:bg-green-500 active:bg-green-700 text-white w-full">
        {t("share")}
      </button>
    </CopyToClipboard>
  );
}
