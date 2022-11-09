import { Guesses } from "../Guesses";
import { Panel } from "./Panel";
import React from "react";
import { Breedle } from "../Breedle";
import { SettingsData } from "../../hooks/useSettings";
import { Twemoji } from "@teuteuf/react-emoji-render";
import { breeds } from "../../domain/breeds.mapping";

interface InfosProps {
  isOpen: boolean;
  close: () => void;
  settingsData: SettingsData;
}

export function Infos({ isOpen, close, settingsData }: InfosProps) {
  const exampleTarget = breeds.find((b) => b.code === "french_bulldog");

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
            Incorrect:{" "}
            <Twemoji text="💩" options={{ className: "inline-block" }} />
          </li>
          <li>
            Correct:{" "}
            <Twemoji text="🦴" options={{ className: "inline-block" }} />
          </li>
        </ul>
      </div>
      <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3">
        <div className="font-bold">Examples</div>
        <div>
          <Guesses
            rowCount={1}
            guesses={[
              {
                code: "golden_retriever",
                name: "Golden Retriever",
                group: 3,
                origin: ["GB"],
                size: [2],
                correct: false,
              },
            ]}
            targetBreed={exampleTarget}
            settingsData={settingsData}
          />
          <div className="my-2">
            Your guess{" "}
            <span className="uppercase font-bold">Golden Retriever</span> is in
            the wrong group, from the wrong origin and has a different height to
            the secret breed.
          </div>
        </div>
        <div>
          <Guesses
            rowCount={1}
            guesses={[
              {
                code: "poodle",
                name: "Poodle",
                group: 7,
                origin: ["FR", "DE"],
                size: [1, 2],
                correct: false,
              },
            ]}
            targetBreed={exampleTarget}
            settingsData={settingsData}
          />
          <div className="my-2">
            Your second guess{" "}
            <span className="uppercase font-bold">Poodle</span> is getting
            closer! The group is correct, one of the origins is correct and one
            of the height categories is correct!
          </div>
        </div>
        <div>
          <Guesses
            rowCount={1}
            guesses={[
              {
                code: "french_bulldog",
                name: "French Bulldog",
                group: 7,
                origin: ["FR"],
                size: [1],
                correct: true,
              },
            ]}
            targetBreed={exampleTarget}
            settingsData={settingsData}
          />
          <div className="my-2">
            Your next guess,{" "}
            <span className="uppercase font-bold">French Bulldog</span>, is the
            correct breed of the day! Congrats you found the bone!{" "}
            <Twemoji text="🦴" options={{ className: "inline-block" }} />
          </div>
        </div>
      </div>
      <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3 font-bold">
        A new <Breedle /> will be available every day!
      </div>
      <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3">
        <Breedle /> only uses ANKC recognised breeds. With{" "}
        <Twemoji text="❤️" options={{ className: "inline-block" }} /> from
        Australia.
      </div>
      <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3">
        <div className="font-bold">Sources</div>
        <div>
          <a
            className="underline"
            href="https://dogsaustralia.org.au/media/9641/breed-listing-breeds-19-11-2021-2.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dogs Australia (ANKC) Breeds by Group
          </a>
        </div>
        <div>
          <a
            className="underline"
            href="https://en.wikipedia.org/wiki/Category:Dog_breeds_by_country_of_origin"
            target="_blank"
            rel="noopener noreferrer"
          >
            Breeds categorised by Origin
          </a>
        </div>
        <div>
          <a
            className="underline"
            href="https://www.dogsindepth.com/dog_breed_size_chart.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Breeds categorised by Height
          </a>
        </div>
      </div>
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
          ) - in connection with{" "}
          <a
            className="underline"
            href="https://www.heydoggydoor.com.au/breeder"
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
        <div>
          Any questions or suggestions?{" "}
          <a
            className="underline"
            href="mailto:support@doggydoor.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Send me an email!
          </a>
        </div>
      </div>
    </Panel>
  );
}
