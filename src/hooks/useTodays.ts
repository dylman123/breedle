import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import seedrandom from "seedrandom";
import {
  bigEnoughCountriesWithImage,
  countriesWithImage,
  Country,
  smallCountryLimit,
} from "../domain/countries";
import { areas } from "../domain/countries.area";
import { CountryCode } from "../domain/countries.position";
import { Guess, loadAllGuesses, saveGuesses } from "../domain/guess";

const forcedCountries: Record<string, CountryCode> = {
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
  // "2022-04-04": "affenpinscher",
  // "2022-04-05": "affenpinscher",
  // "2022-04-06": "affenpinscher",
  // "2022-04-07": "affenpinscher",
  // "2022-04-08": "affenpinscher",
  // "2022-04-09": "affenpinscher",
  // "2022-04-10": "affenpinscher",
  // "2022-04-11": "affenpinscher",
  // "2022-04-12": "affenpinscher",
  // "2022-04-13": "affenpinscher",
  // "2022-04-14": "affenpinscher",
  // "2022-04-15": "affenpinscher",
  // "2022-04-16": "affenpinscher",
  // "2022-04-17": "affenpinscher",
  // "2022-04-18": "affenpinscher",
  // "2022-04-19": "affenpinscher",
  // "2022-04-20": "affenpinscher",
  // "2022-04-21": "affenpinscher",
  // "2022-04-22": "affenpinscher",
  // "2022-04-23": "affenpinscher",
  // "2022-04-24": "affenpinscher",
  // "2022-04-25": "affenpinscher",
  // "2022-04-26": "affenpinscher",
  // "2022-04-27": "affenpinscher",
  // "2022-04-28": "affenpinscher",
  // "2022-04-29": "affenpinscher",
  // "2022-04-30": "affenpinscher",
  // "2022-05-01": "affenpinscher",
  // "2022-05-02": "affenpinscher",
  // "2022-05-03": "affenpinscher",
  // "2022-05-04": "affenpinscher",
  // "2022-05-05": "affenpinscher",
  // "2022-05-06": "affenpinscher",
  // "2022-05-07": "affenpinscher",
  // "2022-05-08": "affenpinscher",
  // "2022-05-09": "affenpinscher",
  // "2022-05-10": "affenpinscher",
  // "2022-05-11": "affenpinscher",
  // "2022-05-12": "affenpinscher",
  // "2022-05-13": "affenpinscher",
  // "2022-05-14": "affenpinscher",
  // "2022-05-15": "affenpinscher",
  // "2022-05-16": "affenpinscher",
  // "2022-05-17": "affenpinscher",
  // "2022-05-18": "affenpinscher",
  // "2022-05-19": "affenpinscher",
  // "2022-05-20": "affenpinscher",
  // "2022-05-21": "affenpinscher",
  // "2022-05-22": "affenpinscher",
  // "2022-05-23": "affenpinscher",
  // "2022-05-24": "affenpinscher",
  // "2022-05-25": "affenpinscher",
  // "2022-05-26": "affenpinscher",
  // "2022-05-27": "affenpinscher",
  // "2022-05-28": "affenpinscher",
  // "2022-05-29": "affenpinscher",
  // "2022-05-30": "affenpinscher",
  // "2022-05-31": "affenpinscher",
  // "2022-06-01": "affenpinscher",
  // "2022-06-02": "affenpinscher",
  // "2022-06-03": "affenpinscher",
  // "2022-06-04": "affenpinscher",
  // "2022-06-05": "affenpinscher",
  // "2022-06-06": "affenpinscher",
  // "2022-06-07": "affenpinscher",
  // "2022-06-08": "affenpinscher",
  // "2022-06-09": "affenpinscher",
  // "2022-06-10": "affenpinscher",
  // "2022-06-11": "affenpinscher",
  // "2022-06-12": "affenpinscher",
  // "2022-06-13": "affenpinscher",
  // "2022-06-14": "affenpinscher",
  // "2022-06-15": "affenpinscher",
  // "2022-06-16": "affenpinscher",
  // "2022-06-17": "affenpinscher",
  // "2022-06-18": "affenpinscher",
  // "2022-06-19": "affenpinscher",
  // "2022-06-20": "affenpinscher",
  // "2022-06-21": "affenpinscher",
  // "2022-06-22": "affenpinscher",
  // "2022-06-23": "affenpinscher",
  // "2022-06-24": "affenpinscher",
  // "2022-06-25": "affenpinscher",
  // "2022-06-26": "affenpinscher",
  // "2022-06-27": "affenpinscher",
  // "2022-06-28": "affenpinscher",
  // "2022-06-29": "affenpinscher",
  // "2022-06-30": "affenpinscher",
  // "2022-07-01": "affenpinscher",
};

const noRepeatStartDate = DateTime.fromFormat("2022-05-01", "yyyy-MM-dd");

export function getDayString(shiftDayCount?: number) {
  return DateTime.now()
    .plus({ days: shiftDayCount ?? 0 })
    .toFormat("yyyy-MM-dd");
}

export function useTodays(dayString: string): [
  {
    country?: Country;
    guesses: Guess[];
  },
  (guess: Guess) => void,
  number,
  number
] {
  const [todays, setTodays] = useState<{
    country?: Country;
    guesses: Guess[];
  }>({ guesses: [] });

  const addGuess = useCallback(
    (newGuess: Guess) => {
      if (todays == null) {
        return;
      }

      const newGuesses = [...todays.guesses, newGuess];

      setTodays((prev) => ({ country: prev.country, guesses: newGuesses }));
      saveGuesses(dayString, newGuesses);
    },
    [dayString, todays]
  );

  useEffect(() => {
    const guesses = loadAllGuesses()[dayString] ?? [];
    const country = getCountry(dayString);

    setTodays({ country, guesses });
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

function getCountry(dayString: string) {
  const currentDayDate = DateTime.fromFormat(dayString, "yyyy-MM-dd");
  let pickingDate = DateTime.fromFormat("2022-03-21", "yyyy-MM-dd");
  let smallCountryCooldown = 0;
  let pickedCountry: Country | null = null;

  const lastPickDates: Record<string, DateTime> = {};

  do {
    smallCountryCooldown--;

    const pickingDateString = pickingDate.toFormat("yyyy-MM-dd");

    const forcedCountryCode = forcedCountries[dayString];
    const forcedCountry =
      forcedCountryCode != null
        ? countriesWithImage.find(
            (country) => country.code === forcedCountryCode
          )
        : undefined;

    const countrySelection =
      smallCountryCooldown < 0
        ? countriesWithImage
        : bigEnoughCountriesWithImage;

    if (forcedCountry != null) {
      pickedCountry = forcedCountry;
    } else {
      let countryIndex = Math.floor(
        seedrandom.alea(pickingDateString)() * countrySelection.length
      );
      // console.log({ countryIndex, countrySelection });
      pickedCountry = countrySelection[countryIndex];

      if (pickingDate >= noRepeatStartDate) {
        while (isARepeat(pickedCountry, lastPickDates, pickingDate)) {
          countryIndex = (countryIndex + 1) % countrySelection.length;
          pickedCountry = countrySelection[countryIndex];
        }
      }
    }

    if (areas[pickedCountry.code] < smallCountryLimit) {
      smallCountryCooldown = 7;
    }

    lastPickDates[pickedCountry.code] = pickingDate;
    pickingDate = pickingDate.plus({ day: 1 });
  } while (pickingDate <= currentDayDate);

  return pickedCountry;
}

function isARepeat(
  pickedCountry: Country | null,
  lastPickDates: Record<string, DateTime>,
  pickingDate: DateTime
) {
  if (pickedCountry == null || lastPickDates[pickedCountry.code] == null) {
    return false;
  }
  const daysSinceLastPick = pickingDate.diff(
    lastPickDates[pickedCountry.code],
    "day"
  ).days;

  return daysSinceLastPick < 100;
}
