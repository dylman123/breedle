import {
  computeProximityPercent,
  formatDistance,
  generateSquareCharacters,
  getDirectionEmoji,
  getResultEmoji,
  isNameCorrect,
  isGroupCorrect,
  isOriginCorrect,
  calculateSizeMatch,
  generateSizeMap,
} from "../domain/util";
import { Guess } from "../domain/guess";
import React, { useCallback, useEffect, useState } from "react";
import CountUp from "react-countup";
import { SettingsData } from "../hooks/useSettings";
import { Twemoji } from "@teuteuf/react-emoji-render";
import { Breed, getBreedName, sanitizeBreedName } from "../domain/breeds";
import { areas } from "../domain/breeds.area";
import { breeds } from "../domain/breeds.mapping";
import { groupNames } from "../domain/groups.mapping";
import { originNames } from "../domain/origins.mapping";
import { heights } from "../domain/sizes.mapping";
// import { sizeNames } from "../domain/sizes.mapping";
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

  const guessedName = guess?.name;

  const guessedGroup = guess && groupNames[guess?.group];

  const guessedOrigin = (
    <div className="flex flex-row gap-1 items-center justify-start">
      {guess &&
        guess?.origin.map((o) => {
          return (
            <div
              key={`origin-${o}`}
              className={`border-2 rounded px-2 h-8 ${
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

  const sizeData = calculateSizeMatch(guess, targetBreed);

  const sizeMapGuess = (
    <div className="grid grid-rows-1">
      <div className="row-span-1 grid grid-cols-32 grid-rows-1 grid-flow-col">
        {generateSizeMap(sizeData.minG, sizeData.maxG, 0).map((s, idx) => (
          <div key={`sq-G${idx}`} className="w-2 col-span-1">
            {s}
          </div>
        ))}
      </div>
    </div>
  );

  const sizeMapTarget = (
    <div className="grid grid-rows-1">
      <div className="row-span-1 grid grid-cols-32 grid-rows-1 grid-flow-col">
        {generateSizeMap(sizeData.minT, sizeData.maxT, 1).map((s, idx) => (
          <div key={`sq-G${idx}`} className="w-2 col-span-1">
            {s}
          </div>
        ))}
      </div>
    </div>
  );

  const sizeBgColor =
    sizeData.percentOverlap < 30
      ? "bg-black"
      : sizeData.percentOverlap < 70
      ? "bg-blue-500"
      : sizeData.percentOverlap < 100
      ? "bg-yellow-500"
      : sizeData.percentOverlap == 100
      ? "bg-green-500"
      : "bg-black";

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
          className={`my-1 col-span-7 h-8 bg-gray-200 dark:bg-slate-600 rounded my-6 mx-12`}
        />
      );
    case "RUNNING":
      return (
        <>
          <div
            className={`flex text-2xl justify-evenly items-center col-span-7 border-2 h-8 rounded my-6 mx-12`}
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
              end={sizeData.percentOverlap}
              suffix="%"
              duration={(SQUARE_ANIMATION_LENGTH * 5) / 1000}
            />
          </div> */}
        </>
      );
    case "ENDED":
      return (
        <div className="grid grid-cols-7 grid-rows-5 gap-1 text-center my-6 mr-12">
          {guess && targetBreed && (
            <Twemoji
              className="flex items-center justify-center h-8 col-span-1 animate-reveal"
              text={getResultEmoji(guess, targetBreed)}
            />
          )}
          <p className="flex items-center justify-start h-8 col-span-6 animate-reveal text-ellipsis overflow-hidden whitespace-nowrap">
            {guessedName}
          </p>
          <Twemoji
            className="flex items-center justify-center h-8 col-span-1 animate-reveal"
            text="📒"
          />
          <div
            className={`flex items-center justify-center border-2 h-8 col-span-6 animate-reveal rounded ${
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
            className={`flex items-center justify-center h-8 col-span-6 animate-reveal`}
          >
            {/* {`${sizeData.percentOverlap}%`} */}
            {sizeMapGuess}
          </div>
          <Twemoji
            className="flex items-center justify-center h-8 col-span-1 animate-reveal"
            text=""
          />
          <div
            // className={`flex items-center justify-center h-8 col-span-6 animate-reveal rounded border-2 ${sizeBgColor}`}
            className={`flex items-center justify-center h-8 col-span-6 animate-reveal`}
          >
            {/* {`${sizeData.percentOverlap}%`} */}
            {sizeMapTarget}
          </div>
        </div>
      );
  }
}
