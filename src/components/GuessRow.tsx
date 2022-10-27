import {
  computeProximityPercent,
  formatDistance,
  generateSquareCharacters,
  getDirectionEmoji,
  getResultEmoji,
} from "../domain/geography";
import { Guess } from "../domain/guess";
import React, { useCallback, useEffect, useState } from "react";
import CountUp from "react-countup";
import { SettingsData } from "../hooks/useSettings";
import { Twemoji } from "@teuteuf/react-emoji-render";
import { Breed, getBreedName, sanitizeBreedName } from "../domain/breeds";
import { areas } from "../domain/breeds.area";
import { breeds } from "../domain/breeds.position";
import { useTranslation } from "react-i18next";

const SQUARE_ANIMATION_LENGTH = 250;
type AnimationState = "NOT_STARTED" | "RUNNING" | "ENDED";

interface GuessRowProps {
  targetBreed?: Breed;
  guess?: Guess;
  settingsData: SettingsData;
  breedInputRef?: React.RefObject<HTMLInputElement>;
}

export function GuessRow({
  targetBreed,
  guess,
  settingsData,
  breedInputRef,
}: GuessRowProps) {
  const { i18n } = useTranslation();
  const { distanceUnit, theme } = settingsData;
  const proximity = guess != null ? computeProximityPercent(guess.distance) : 0;
  const squares = generateSquareCharacters(proximity, theme);

  const guessedBreed =
    guess &&
    breeds.find(
      (breed) =>
        sanitizeBreedName(getBreedName(i18n.resolvedLanguage, breed)) ===
        sanitizeBreedName(guess.name)
    );

  const sizePercent =
    targetBreed &&
    guessedBreed &&
    Math.min(
      999,
      Math.round((areas[targetBreed.code] / areas[guessedBreed.code]) * 100)
    );

  const percentToDisplay =
    settingsData.showScale && sizePercent != null ? sizePercent : proximity;

  const [animationState, setAnimationState] =
    useState<AnimationState>("NOT_STARTED");

  useEffect(() => {
    setAnimationState("NOT_STARTED");

    if (guess == null) {
      return;
    }

    setAnimationState("RUNNING");
    const timeout = setTimeout(() => {
      setAnimationState("ENDED");
    }, SQUARE_ANIMATION_LENGTH * 6);

    return () => {
      clearTimeout(timeout);
    };
  }, [guess]);

  const handleClickOnEmptyRow = useCallback(() => {
    if (breedInputRef?.current != null) {
      breedInputRef?.current.focus();
    }
  }, [breedInputRef]);

  switch (animationState) {
    case "NOT_STARTED":
      return (
        <div
          onClick={handleClickOnEmptyRow}
          className={`col-span-7 h-8 bg-gray-200 dark:bg-slate-600 rounded`}
        />
      );
    case "RUNNING":
      return (
        <>
          <div
            className={`flex text-2xl w-full justify-evenly items-center col-span-7 border-2 h-8 rounded`}
          >
            {squares.map((character, index) => (
              <div
                key={index}
                className="opacity-0 animate-reveal"
                style={{
                  animationDelay: `${SQUARE_ANIMATION_LENGTH * index}ms`,
                }}
              >
                <Twemoji text={character} />
              </div>
            ))}
          </div>
          {/* <div className="flex items-center justify-center border-2 h-8 col-span-1 animate-reveal rounded">
            <CountUp
              end={percentToDisplay}
              suffix="%"
              duration={(SQUARE_ANIMATION_LENGTH * 5) / 1000}
            />
          </div> */}
        </>
      );
    case "ENDED":
      return (
        <>
          <div className="flex items-center justify-center border-2 h-8 col-span-6 animate-reveal rounded">
            <p className="text-ellipsis overflow-hidden whitespace-nowrap">
              {guess?.name}
            </p>
          </div>
          {/* <div className="flex items-center justify-center border-2 h-8 col-span-2 animate-reveal rounded">
            {guess && formatDistance(guess.distance, distanceUnit)}
          </div> */}
          <div className="flex items-center justify-center border-2 h-8 col-span-1 animate-reveal rounded">
            {guess && targetBreed && (
              <Twemoji
                className="flex items-center"
                text={getResultEmoji(guess, targetBreed)}
              />
            )}
          </div>
          {/* <div className="flex items-center justify-center border-2 h-8 col-span-1 animate-reveal animate-pop rounded">
            {`${percentToDisplay}%`}
          </div> */}
        </>
      );
  }
}
