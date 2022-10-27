import React from "react";
import { Twemoji } from "@teuteuf/react-emoji-render";

export function Breedle() {
  return (
    <span className="font-bold flex flex-direction row text-yellow-300">
      <span className="flex flex-direction row">
        BREED
        <Twemoji
          className="flex items-center emote"
          text="🐕"
          options={{ className: "inline-block", baseUrl: "Apple" }}
        />
      </span>
      E
    </span>
  );
}
