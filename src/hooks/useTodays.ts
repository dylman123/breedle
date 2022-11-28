import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import seedrandom from "seedrandom";
import {
  allBreeds,
  commonBreeds,
  uncommonBreeds,
  Breed,
} from "../domain/breeds";
import { BreedCode } from "../domain/breeds.mapping";
import { Guess, loadAllGuesses, saveGuesses } from "../domain/guess";
import { SettingsData } from "./useSettings";

const forcedBreeds: Record<string, BreedCode> = {
  // "2022-02-02": "affenpinscher",
  // "2022-02-03": "affenpinscher",
  // "2022-03-21": "affenpinscher",
};

const noRepeatStartDate = DateTime.fromFormat("2022-05-22", "yyyy-MM-dd");

export function getDayString(shiftDayCount?: number) {
  return DateTime.now()
    .plus({ days: shiftDayCount ?? 0 })
    .toFormat("yyyy-MM-dd");
}

export function useTodays(
  dayString: string,
  settingsData: SettingsData
): [
  {
    breed?: Breed;
    guesses: Guess[];
  },
  (guess: Guess) => void,
  number,
  number
] {
  const [todays, setTodays] = useState<{
    breed?: Breed;
    guesses: Guess[];
  }>({ guesses: [] });
  const advancedMode = settingsData.advancedMode;

  const addGuess = useCallback(
    (newGuess: Guess) => {
      if (todays == null) {
        return;
      }

      const newGuesses = [...todays.guesses, newGuess];

      setTodays((prev) => ({
        breed: prev.breed,
        guesses: newGuesses,
      }));
      saveGuesses(dayString, advancedMode, newGuesses);
    },
    [dayString, todays, advancedMode]
  );

  useEffect(() => {
    const guesses = loadAllGuesses(advancedMode)[dayString] ?? [];
    const breed = getBreed(dayString, advancedMode);

    setTodays({ breed, guesses });
  }, [dayString, advancedMode]);

  const randomAngle = useMemo(
    () => seedrandom.alea(dayString)() * 360,
    [dayString]
  );

  const imageScale = useMemo(() => {
    const normalizedAngle = 45 - (randomAngle % 90);
    const radianAngle = (normalizedAngle * Math.PI) / 180;
    return 1 / (Math.cos(radianAngle) * Math.sqrt(2));
  }, [randomAngle]);

  return [todays, addGuess, randomAngle, imageScale];
}

function getBreed(dayString: string, advancedMode: boolean) {
  const currentDayDate = DateTime.fromFormat(dayString, "yyyy-MM-dd");
  let pickingDate = DateTime.fromFormat("2022-11-22", "yyyy-MM-dd");
  let pickedBreed: Breed | null = null;

  const lastPickDates: Record<string, DateTime> = {};

  do {
    const pickingDateString = pickingDate.toFormat("yyyy-MM-dd");

    const forcedBreedCode = forcedBreeds[dayString];
    const forcedBreed =
      forcedBreedCode != null
        ? allBreeds.find((breed) => breed.code === forcedBreedCode)
        : undefined;

    const breedSelection = advancedMode ? uncommonBreeds : commonBreeds;

    const seed = pickingDateString.concat(advancedMode ? "a" : "");

    if (forcedBreed != null) {
      pickedBreed = forcedBreed;
    } else {
      let breedIndex = Math.floor(
        seedrandom.alea(seed)() * breedSelection.length
      );
      pickedBreed = breedSelection[breedIndex];

      if (pickingDate >= noRepeatStartDate) {
        while (isARepeat(pickedBreed, lastPickDates, pickingDate)) {
          breedIndex = (breedIndex + 1) % breedSelection.length;
          pickedBreed = breedSelection[breedIndex];
        }
      }
    }

    lastPickDates[pickedBreed.code] = pickingDate;
    pickingDate = pickingDate.plus({ day: 1 });
  } while (pickingDate <= currentDayDate);

  return pickedBreed;
}

function isARepeat(
  pickedBreed: Breed | null,
  lastPickDates: Record<string, DateTime>,
  pickingDate: DateTime
) {
  if (pickedBreed == null || lastPickDates[pickedBreed.code] == null) {
    return false;
  }
  const daysSinceLastPick = pickingDate.diff(
    lastPickDates[pickedBreed.code],
    "day"
  ).days;

  return daysSinceLastPick < 100;
}
