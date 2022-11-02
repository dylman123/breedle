// Source:
// Breeds with long/lat => https://developers.google.com/public-data/docs/canonical/breeds_csv
// Breeds images => https://github.com/djaiss/mapsicon
// Breed area => https://github.com/samayo/breed-json/blob/master/src/breed-by-surface-area.json

import { areas } from "./breeds.area";
import { breeds } from "./breeds.mapping";
import { breedCodesWithImage } from "./breeds.image";

// import { corsicanBreedNames } from "./breeds.name.co";
// import { frenchBreedNames } from "./breeds.name.fr";
// import { hungarianBreedNames } from "./breeds.name.hu";
// import { dutchBreedNames } from "./breeds.name.nl";
// import { polishBreedNames } from "./breeds.name.pl";
// import { germanBreedNames } from "./breeds.name.de";
// import { japaneseBreedNames } from "./breeds.name.ja";

export interface Breed {
  code: string;
  latitude: number;
  longitude: number;
  name: string;
  image: number;
  group: number;
  origin: string | readonly string[];
}

export const breedsWithImage = breeds.filter((c) =>
  breedCodesWithImage.includes(c.code.toLowerCase())
);

export const smallBreedLimit = 5000;
export const bigEnoughBreedsWithImage = breedsWithImage.filter(
  (breed) => areas[breed.code] > smallBreedLimit
);

export function getBreedName(language: string, breed: Breed) {
  switch (language) {
    // case "co":
    //   return corsicanBreedNames[breed.code];
    // case "fr":
    //   return frenchBreedNames[breed.code];
    // case "hu":
    //   return hungarianBreedNames[breed.code];
    // case "nl":
    //   return dutchBreedNames[breed.code];
    // case "pl":
    //   return polishBreedNames[breed.code];
    // case "de":
    //   return germanBreedNames[breed.code];
    // case "ja":
    //   return japaneseBreedNames[breed.code];
    default:
      return breed.name;
  }
}

export function sanitizeBreedName(breedName: string): string {
  return breedName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[- '()]/g, "")
    .toLowerCase();
}
