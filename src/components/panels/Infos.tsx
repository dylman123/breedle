import { Guesses } from "../Guesses";
import { Panel } from "./Panel";
import React from "react";
import { Breedle } from "../Breedle";
import { formatDistance } from "../../domain/geography";
import { SettingsData } from "../../hooks/useSettings";
import { Twemoji } from "@teuteuf/react-emoji-render";

interface InfosProps {
  isOpen: boolean;
  close: () => void;
  settingsData: SettingsData;
}

export function Infos({ isOpen, close, settingsData }: InfosProps) {
  return (
    <Panel title="How to play" isOpen={isOpen} close={close}>
      <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3">
        <div>
          Guess the <Breedle /> in 6 guesses to get the bone and avoid the poop.
        </div>
        <div>Each guess must be a valid dog breed.</div>
        <div>
          After each guess, you will be given feedback on whether you were
          correct or incorrect with the following emojis.
        </div>
        <ul>
          <li>
            Incorrect:
            <Twemoji text="💩" options={{ className: "inline-block" }} />
          </li>
          <li>
            Correct:
            <Twemoji text="🦴" options={{ className: "inline-block" }} />
          </li>
        </ul>
      </div>
      {/* <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3">
        <div className="font-bold">Examples</div>
        <div>
          <Guesses
            rowCount={1}
            guesses={[
              {
                name: "Chile",
                direction: "NE",
                distance: 13_557_000,
                code: "chile",
              },
            ]}
            settingsData={settingsData}
          />
          <div className="my-2">
            Your guess <span className="uppercase font-bold">Chile</span> is{" "}
            {formatDistance(13557000, settingsData.distanceUnit)} away from the
            target location, the target location is in the North-East direction
            and you have a only 32% of proximity because it&apos;s quite far
            away!
          </div>
        </div>
        <div>
          <Guesses
            rowCount={1}
            guesses={[
              {
                name: "Finland",
                direction: "SE",
                distance: 3_206_000,
                code: "finland",
              },
            ]}
            settingsData={settingsData}
          />
          <div className="my-2">
            Your second guess{" "}
            <span className="uppercase font-bold">Finland</span> is getting
            closer! {formatDistance(3206000, settingsData.distanceUnit)} away,
            South-East direction and 84%!
          </div>
        </div>
        <div>
          <Guesses
            rowCount={1}
            guesses={[
              {
                name: "Lebanon",
                direction: "N",
                distance: 0,
                code: "lebanon",
              },
            ]}
            settingsData={settingsData}
          />
          <div className="my-2">
            Next guess, <span className="uppercase font-bold">Lebanon</span>,
            it&apos;s the location to guess! Congrats!{" "}
            <Twemoji text="🎉" options={{ className: "inline-block" }} />
          </div>
        </div>
      </div> */}
      <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3 font-bold">
        A new <Breedle /> will be available every day!
      </div>
      {/* <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3">
        <div className="font-bold">Any question or suggestion?</div>
        <div>
          Check the{" "}
          <a
            className="underline"
            href="https://worldle.notion.site/Breedle-b84ab0f002e34866980a4d47cf9291b7"
            target="_blank"
            rel="noopener noreferrer"
          >
            Breedle FAQ
          </a>
          !
        </div>
      </div> */}
      <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3">
        <Breedle /> has been <span className="font-bold">heavily</span> inspired
        by{" "}
        <a
          className="underline"
          href="https://worldle.teuteuf.fr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Worldle
        </a>{" "}
        created by{" "}
        <a
          className="underline"
          href="https://twitter.com/teuteuf"
          target="_blank"
          rel="noopener noreferrer"
        >
          @teuteuf
        </a>
        .
      </div>
      <div className="space-y-3 text-justify pb-3">
        <div>
          Made by @dylman123 - (
          <a
            className="underline"
            href="https://github.com/dylman123/breedle"
            target="_blank"
            rel="noopener noreferrer"
          >
            source code
          </a>
          ) - in connection with .
          <a
            className="underline"
            href="https://www.heydoggydoor.com.au/"
            target="_blank"
            rel="noopener noreferrer"
          >
            DoggyDoor
          </a>
          .
        </div>
        <div>
          Want to support?{" "}
          <a
            className="underline"
            href="https://ko-fi.com/dylman123"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twemoji
              text="Buy me a coffee! ☕"
              options={{ className: "inline-block" }}
            />
          </a>
        </div>
      </div>
    </Panel>
  );
}
