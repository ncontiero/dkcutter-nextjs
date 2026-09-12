import { defineRouting } from "next-intl/routing";

export const NEXT_LOCALE_COOKIE_NAME = "NEXT_LOCALE";

export const routing = defineRouting({
  locales: ["en"],
  defaultLocale: "en",
  localeCookie: {
    name: NEXT_LOCALE_COOKIE_NAME,
  },
});
