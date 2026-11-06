import en from "./en";
import ar from "./ar";
import bn from "./bn";
import type { Locale } from "../config";
import type { Dictionary } from "./types";

const dictionaries: Record<Locale, Dictionary> = { en, ar, bn };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
