import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import seedrandom from "seedrandom";
import {
  bigEnoughBreedsWithImage,
  breedsWithImage,
  Breed,
  smallBreedLimit,
} from "../domain/breeds";
import { areas } from "../domain/breeds.area";
import { BreedCode } from "../domain/breeds.mapping";
import { Guess, loadAllGuesses, saveGuesses } from "../domain/guess";

const forcedBreeds: Record<string, BreedCode> = {
  // "2022-02-02": "affenpinscher",
  // "2022-02-03": "affenpinscher",
  // "2022-03-21": "affenpinscher",
  // "2022-03-22": "affenpinscher",
  // "2022-03-23": "affenpinscher",
  // "2022-03-24": "affenpinscher",
  // "2022-03-25": "affenpinscher",
  // "2022-03-26": "affenpinscher",
  // "2022-03-27": "affenpinscher",
  // "2022-03-28": "affenpinscher",
  // "2022-03-29": "affenpinscher",
  // "2022-03-30": "affenpinscher",
  // "2022-03-31": "affenpinscher",
  // "2022-04-01": "affenpinscher",
  // "2022-04-02": "affenpinscher",
  // "2022-04-03": "affenpinscher",
};

const noRepeatStartDate = DateTime.fromFormat("2022-05-01", "yyyy-MM-dd");

export function getDayString(shiftDayCount?: number) {
  return DateTime.now()
    .plus({ days: shiftDayCount ?? 0 })
    .toFormat("yyyy-MM-dd");
}

export function useTodays(dayString: string): [
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

  const addGuess = useCallback(
    (newGuess: Guess) => {
      if (todays == null) {
        return;
      }

      const newGuesses = [...todays.guesses, newGuess];

      setTodays((prev) => ({ breed: prev.breed, guesses: newGuesses }));
      saveGuesses(dayString, newGuesses);
    },
    [dayString, todays]
  );

  useEffect(() => {
    const guesses = loadAllGuesses()[dayString] ?? [];
    const breed = getBreed(dayString);

    setTodays({ breed, guesses });
  }, [dayString]);

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

function getBreed(dayString: string) {
  const currentDayDate = DateTime.fromFormat(dayString, "yyyy-MM-dd");
  let pickingDate = DateTime.fromFormat("2022-03-21", "yyyy-MM-dd");
  let smallBreedCooldown = 0;
  let pickedBreed: Breed | null = null;

  const lastPickDates: Record<string, DateTime> = {};

  do {
    smallBreedCooldown--;

    const pickingDateString = pickingDate.toFormat("yyyy-MM-dd");

    const forcedBreedCode = forcedBreeds[dayString];
    const forcedBreed =
      forcedBreedCode != null
        ? breedsWithImage.find((breed) => breed.code === forcedBreedCode)
        : undefined;

    const breedSelection =
      smallBreedCooldown < 0 ? breedsWithImage : bigEnoughBreedsWithImage;

    if (forcedBreed != null) {
      pickedBreed = forcedBreed;
    } else {
      let breedIndex = Math.floor(
        seedrandom.alea(pickingDateString)() * breedSelection.length
      );
      // console.log({ breedIndex, breedSelection });
      pickedBreed = breedSelection[breedIndex];

      if (pickingDate >= noRepeatStartDate) {
        while (isARepeat(pickedBreed, lastPickDates, pickingDate)) {
          breedIndex = (breedIndex + 1) % breedSelection.length;
          pickedBreed = breedSelection[breedIndex];
        }
      }
    }

    if (areas[pickedBreed.code] < smallBreedLimit) {
      smallBreedCooldown = 7;
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
