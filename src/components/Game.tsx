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
import { Share } from "./Share";
import { Guesses } from "./Guesses";
import { useTranslation } from "react-i18next";
import { SettingsData } from "../hooks/useSettings";
import { useMode } from "../hooks/useMode";
import { getDayString, useTodays } from "../hooks/useTodays";
import { Twemoji } from "@teuteuf/react-emoji-render";
import { breeds } from "../domain/breeds.mapping";
import { useNewsNotifications } from "../hooks/useNewsNotifications";
import ConfettiExplosion from "react-confetti-explosion";

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

  const [todays, addGuess, randomAngle, imageScale] = useTodays(
    dayString,
    settingsData
  );
  const { breed, guesses } = todays;
  const breedName = useMemo(
    () => (breed ? getBreedName(i18n.resolvedLanguage, breed) : ""),
    [breed, i18n.resolvedLanguage]
  );

  const [currentGuess, setCurrentGuess] = useState("");
  const [isExploding, setIsExploding] = useState(false);
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
  const advancedMode = settingsData.advancedMode;

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

      const currentGuessObject = breeds.find((b) => b.name === currentGuess);

      const newGuess = {
        name: currentGuess,
        code: currentGuessObject?.code ?? "",
        group: currentGuessObject?.group ?? 0,
        origin: currentGuessObject?.origin ?? [],
        size: currentGuessObject?.size ?? [],
        correct: currentGuessObject?.code === breed.code,
      };

      addGuess(newGuess);
      setCurrentGuess("");

      if (guessedBreed === breed) {
        toast.success(t("welldone"), {
          delay: 2000,
          autoClose: 10000,
          hideProgressBar: false,
          position: "top-center",
          pauseOnHover: false,
        });
        setIsExploding(true);
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
      guesses[guesses.length - 1].code !== breed.code
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
      <div className="flex my-1 mx-auto">
        {/* {settingsData.allowShiftingDay && settingsData.shiftDayCount > 0 && (
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
        )} */}
        <div className="flex flex-col">
          <img
            className={`pointer-events-none max-h-32 m-auto transition-transform duration-700 ease-in mt-4 ${
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
          {advancedMode ? (
            <p className="bg-black text-yellow-500 rounded mt-1 px-1 font-sans">
              Advanced mode
            </p>
          ) : null}
        </div>
        {/* {settingsData.allowShiftingDay && settingsData.shiftDayCount < 7 && (
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
        )} */}
      </div>
      {/* {rotationMode && !hideImageMode && !gameEnded && (
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
      )} */}
      <Guesses
        targetBreed={breed}
        rowCount={MAX_TRY_COUNT}
        guesses={guesses}
        settingsData={settingsData}
        breedInputRef={breedInputRef}
      />
      {gameEnded && isExploding && (
        <div className="overflow-visible flex justify-center">
          <ConfettiExplosion
            height={2 * window.outerHeight}
            width={2 * window.outerWidth}
            force={0.8}
            particleCount={300}
            duration={5000}
          />
        </div>
      )}
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
            <div className="flex flex-wrap gap-2 justify-center">
              <div className="font-bold text-center block mt-4 whitespace-nowrap">
                {breedName}
              </div>
              <a
                className="underline text-center block mt-4 whitespace-nowrap"
                href={`https://dogsaustralia.org.au/members/breeds/breed-standards/${breedName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twemoji
                  text={t("showOnANKC")}
                  options={{ className: "inline-block" }}
                />
              </a>
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
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <BreedInput
                inputRef={breedInputRef}
                currentGuess={currentGuess}
                setCurrentGuess={setCurrentGuess}
                settingsData={settingsData}
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
