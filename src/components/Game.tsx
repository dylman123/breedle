import React, {
  ReactText,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { getBreedName, sanitizeBreedName } from "../domain/breeds";
import { BreedInput } from "./BreedInput";
import * as geolib from "geolib";
import { Share } from "./Share";
import { Guesses } from "./Guesses";
import { useTranslation } from "react-i18next";
import { SettingsData } from "../hooks/useSettings";
import { useMode } from "../hooks/useMode";
import { getDayString, useTodays } from "../hooks/useTodays";
import { Twemoji } from "@teuteuf/react-emoji-render";
import { breeds } from "../domain/breeds.mapping";
import { originNames } from "../domain/origins.mapping";
import { groupNames } from "../domain/groups.mapping";
import { useNewsNotifications } from "../hooks/useNewsNotifications";

const ENABLE_TWITCH_LINK = false;
const MAX_TRY_COUNT = 6;

interface GameProps {
  settingsData: SettingsData;
  updateSettings: (newSettings: Partial<SettingsData>) => void;
}

export function Game({ settingsData, updateSettings }: GameProps) {
  const { t, i18n } = useTranslation();
  const dayString = useMemo(
    () => getDayString(settingsData.shiftDayCount),
    [settingsData.shiftDayCount]
  );

  useNewsNotifications(dayString);

  const breedInputRef = useRef<HTMLInputElement>(null);

  const [todays, addGuess, randomAngle, imageScale] = useTodays(dayString);
  const { breed, guesses } = todays;
  const breedName = useMemo(
    () => (breed ? getBreedName(i18n.resolvedLanguage, breed) : ""),
    [breed, i18n.resolvedLanguage]
  );

  // console.log({ breed });

  const groupName = breed ? groupNames[breed.group] : null;

  const originName = !breed
    ? null
    : Array.isArray(breed.origin)
    ? breed?.origin.map((o) => originNames[o])
    : typeof breed.origin === "string"
    ? originNames[breed.origin]
    : null;

  const [currentGuess, setCurrentGuess] = useState("");
  const [hideImageMode, setHideImageMode] = useMode(
    "hideImageMode",
    dayString,
    settingsData.noImageMode
  );
  const [rotationMode, setRotationMode] = useMode(
    "rotationMode",
    dayString,
    settingsData.rotationMode
  );

  const gameEnded =
    guesses.length === MAX_TRY_COUNT ||
    guesses[guesses.length - 1]?.code === breed?.code;

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      if (breed == null) {
        return;
      }
      e.preventDefault();
      const guessedBreed = breeds.find(
        (breed) =>
          sanitizeBreedName(getBreedName(i18n.resolvedLanguage, breed)) ===
          sanitizeBreedName(currentGuess)
      );

      if (guessedBreed == null) {
        toast.error(t("unknownBreed"));
        return;
      }

      const newGuess = {
        name: currentGuess,
        code:
          breeds.find((c) => c.name === currentGuess)?.code ?? "affenpinscher",
        distance: geolib.getDistance(guessedBreed, breed),
        direction: geolib.getCompassDirection(
          guessedBreed,
          breed,
          (origin, dest) =>
            Math.round(geolib.getRhumbLineBearing(origin, dest) / 45) * 45
        ),
      };

      addGuess(newGuess);
      setCurrentGuess("");

      if (guessedBreed === breed) {
        toast.success(t("welldone"), { delay: 2000 });
      }
    },
    [addGuess, breed, currentGuess, i18n.resolvedLanguage, t]
  );

  useEffect(() => {
    let toastId: ReactText;
    const { breed, guesses } = todays;
    if (
      breed &&
      guesses.length === MAX_TRY_COUNT &&
      guesses[guesses.length - 1].distance > 0
    ) {
      toastId = toast.info(
        getBreedName(i18n.resolvedLanguage, breed).toUpperCase(),
        {
          autoClose: false,
          delay: 2000,
        }
      );
    }

    return () => {
      if (toastId != null) {
        toast.dismiss(toastId);
      }
    };
  }, [todays, i18n.resolvedLanguage]);

  return (
    <div className="flex-grow flex flex-col mx-2">
      {hideImageMode && !gameEnded && (
        <button
          className="font-bold border-2 p-1 rounded uppercase my-2 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-slate-800 dark:active:bg-slate-700"
          type="button"
          onClick={() => setHideImageMode(false)}
        >
          <Twemoji
            text={t("showBreed")}
            options={{ className: "inline-block" }}
          />
        </button>
      )}
      <div className="flex my-1">
        {settingsData.allowShiftingDay && settingsData.shiftDayCount > 0 && (
          <button
            type="button"
            onClick={() =>
              updateSettings({
                shiftDayCount: Math.max(0, settingsData.shiftDayCount - 1),
              })
            }
          >
            <Twemoji text="↪️" className="text-xl" />
          </button>
        )}
        <img
          className={`pointer-events-none max-h-52 m-auto transition-transform duration-700 ease-in ${
            hideImageMode && !gameEnded ? "h-0" : "h-full"
          }`}
          alt="dog breed to guess"
          src={`images/breeds/${breed?.image}.jpg`}
          style={
            rotationMode && !gameEnded
              ? {
                  transform: `rotate(${randomAngle}deg) scale(${imageScale})`,
                }
              : {}
          }
        />
        {settingsData.allowShiftingDay && settingsData.shiftDayCount < 7 && (
          <button
            type="button"
            onClick={() =>
              updateSettings({
                shiftDayCount: Math.min(7, settingsData.shiftDayCount + 1),
              })
            }
          >
            <Twemoji text="↩️" className="text-xl" />
          </button>
        )}
      </div>
      <div className="text-yellow-200">
        {groupName}
        {originName}
      </div>
      {rotationMode && !hideImageMode && !gameEnded && (
        <button
          className="font-bold rounded p-1 border-2 uppercase mb-2 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-slate-800 dark:active:bg-slate-700"
          type="button"
          onClick={() => setRotationMode(false)}
        >
          <Twemoji
            text={t("cancelRotation")}
            options={{ className: "inline-block" }}
          />
        </button>
      )}
      <Guesses
        targetBreed={breed}
        rowCount={MAX_TRY_COUNT}
        guesses={guesses}
        settingsData={settingsData}
        breedInputRef={breedInputRef}
      />
      <div className="my-2">
        {gameEnded && breed ? (
          <>
            <Share
              guesses={guesses}
              dayString={dayString}
              settingsData={settingsData}
              hideImageMode={hideImageMode}
              rotationMode={rotationMode}
              breed={breed}
            />
            <div className="flex flex-wrap gap-4 justify-center">
              {/* <a
                className="underline text-center block mt-4 whitespace-nowrap"
                href={`https://www.google.com/maps?q=${breedName}+${breed.code.toUpperCase()}&hl=${
                  i18n.resolvedLanguage
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twemoji
                  text={t("showOnGoogleMaps")}
                  options={{ className: "inline-block" }}
                />
              </a> */}
              <a
                className="underline text-center block mt-4 whitespace-nowrap"
                href={`https://${i18n.resolvedLanguage}.wikipedia.org/wiki/${breedName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twemoji
                  text={t("showOnWikipedia")}
                  options={{ className: "inline-block" }}
                />
              </a>
            </div>
            {/* {ENABLE_TWITCH_LINK && (
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  className="underline text-center block mt-4 whitespace-nowrap"
                  href="https://www.twitch.tv/t3uteuf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twemoji
                    text="More? Play on Twitch! 👾"
                    options={{ className: "inline-block" }}
                  />
                </a>
              </div>
            )} */}
            {/* <div className="flex flex-wrap gap-4 justify-center">
              <a
                className="underline text-center block mt-4 whitespace-nowrap"
                href="https://emovi.teuteuf.fr/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twemoji
                  text={
                    dayString === "2022-07-17"
                      ? "Let's celebrate #WorldEmojiDay! Play Emovi! 🎥"
                      : "Try my new game, play Emovi! 🎥"
                  }
                  options={{ className: "inline-block" }}
                />
              </a>
            </div> */}
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <BreedInput
                inputRef={breedInputRef}
                currentGuess={currentGuess}
                setCurrentGuess={setCurrentGuess}
              />
              <button
                className="rounded font-bold p-1 flex items-center justify-center border-2 uppercase my-0.5 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-slate-800 dark:active:bg-slate-700"
                type="submit"
              >
                <Twemoji
                  text="🐶"
                  options={{ className: "inline-block" }}
                  className="flex items-center justify-center"
                />{" "}
                <span className="ml-1">{t("guess")}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
