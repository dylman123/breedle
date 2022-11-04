import { Guess } from "../domain/guess";
import { GuessRow } from "./GuessRow";
import React from "react";
import { SettingsData } from "../hooks/useSettings";
import { Breed } from "../domain/breeds";

interface GuessesProps {
  targetBreed?: Breed;
  rowCount: number;
  guesses: Guess[];
  settingsData: SettingsData;
  breedInputRef?: React.RefObject<HTMLInputElement>;
}

export function Guesses({
  targetBreed,
  rowCount,
  guesses,
  settingsData,
  breedInputRef,
}: GuessesProps) {
  return (
    <div>
      {Array.from(Array(rowCount).keys()).map((index) => (
        <GuessRow
          targetBreed={targetBreed}
          key={index}
          guess={guesses[index]}
          settingsData={settingsData}
          breedInputRef={breedInputRef}
        />
      ))}
    </div>
  );
}
