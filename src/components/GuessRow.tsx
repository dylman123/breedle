import {
  generateDogCharacters,
  getResultEmoji,
  isNameCorrect,
  isGroupCorrect,
  isOriginCorrect,
  isSizeCorrect,
} from "../domain/util";
import { Guess } from "../domain/guess";
import React, { useCallback, useEffect, useState } from "react";
import CountUp from "react-countup";
import { SettingsData } from "../hooks/useSettings";
import { Twemoji } from "@teuteuf/react-emoji-render";
import { Breed, getBreedName, sanitizeBreedName } from "../domain/breeds";
import { groupNames } from "../domain/groups.mapping";
import { originNames } from "../domain/origins.mapping";
import { heights } from "../domain/sizes.mapping";
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
  const squares = generateDogCharacters(theme);

  const guessedName = guess?.name;

  const guessedGroup = guess && groupNames[guess?.group];

  const guessedOrigin = (
    <div className="flex flex-row gap-1 items-center justify-start">
      {guess &&
        guess?.origin.map((o) => {
          return (
            <div
              key={`origin-${o}`}
              className={`border-2 rounded px-2 h-8 overflow-hidden ${
                isOriginCorrect(o, targetBreed?.origin)
                  ? "bg-green-500"
                  : "bg-black"
              }`}
            >
              {originNames[o]}
            </div>
          );
        })}
    </div>
  );

  const guessedSize = (
    <div className="flex flex-row gap-1 items-center justify-start">
      {guess &&
        guess?.size.map((s) => {
          return (
            <div
              key={`size-${s}`}
              className={`border-2 rounded px-2 h-8 overflow-hidden ${
                isSizeCorrect(s, targetBreed?.size)
                  ? "bg-green-500"
                  : "bg-black"
              }`}
            >
              {heights[s]}
            </div>
          );
        })}
    </div>
  );

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
          className={`my-1 col-span-7 h-8 bg-gray-200 dark:bg-slate-600 rounded my-8 mx-12`}
        />
      );
    case "RUNNING":
      return (
        <>
          <div
            className={`flex text-2xl justify-evenly items-center col-span-7 border-2 h-8 rounded my-8 mx-12`}
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
        </>
      );
    case "ENDED":
      return (
        <div className="grid grid-cols-7 grid-rows-4 gap-1 text-center my-8 mr-12">
          {guess && targetBreed && (
            <Twemoji
              className="flex items-center justify-center h-8 col-span-1 animate-reveal"
              text={getResultEmoji(guess, targetBreed)}
            />
          )}
          <p className="flex items-center justify-start h-8 col-span-6 animate-reveal text-ellipsis overflow-hidden whitespace-nowrap font-bold">
            {guessedName}
          </p>
          <Twemoji
            className="flex items-center justify-center h-8 col-span-1 animate-reveal"
            text="📒"
          />
          <div
            className={`flex items-center justify-center border-2 h-8 col-span-6 animate-reveal rounded overflow-hidden ${
              isGroupCorrect(guess, targetBreed) ? "bg-green-500" : "bg-black"
            }`}
          >
            {guessedGroup}
          </div>
          <Twemoji
            className="flex items-center justify-center h-8 col-span-1 animate-reveal"
            text="🌏"
          />
          <div className={`col-span-6 animate-reveal`}>{guessedOrigin}</div>
          <Twemoji
            className="flex items-center justify-center h-8 col-span-1 animate-reveal"
            text="📏"
          />
          <div
            // className={`flex items-center justify-center h-8 col-span-6 animate-reveal rounded border-2 ${sizeBgColor}`}
            className={`flex items-center justify-start h-8 col-span-6 animate-reveal`}
          >
            {guessedSize}
          </div>
        </div>
      );
  }
}
