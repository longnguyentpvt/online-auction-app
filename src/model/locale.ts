import { EventEmitter } from "utils/event-emitter";

import { EventName } from "types/event-emitter";

let currentLan: "en" | "vn" = null;
let currentLocale: Record<string, string> = {};

export const subcribeChangeEvent = (callback) => {
  EventEmitter.subscribe(EventName.LocaleChange, callback);
};

export const unsubcribeChangeEvent = (callback) => {
  EventEmitter.subscribe(EventName.LocaleChange, callback);
};

export const changeLan = async (newLan: "en" | "vn"): Promise<void> => {
  if (newLan !== currentLan) {
    switch (newLan) {
      case "en":
        currentLocale = await import("/data/locale/en.json");
        break;
      case "vn":
        currentLocale = {};
        break;
    }

    EventEmitter.emit(EventName.LocaleChange, currentLocale);
  }
};

export const getLan = () => {
  return currentLocale;
}

const loadStorage = async(): Promise<void> => {
  const assumeLocale = "en";
  await changeLan(assumeLocale);
}
loadStorage();
