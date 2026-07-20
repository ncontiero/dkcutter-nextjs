import { vi } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => {
    const t = (key: string) => key;
    t.rich = (key: string, values?: { link?: (chunk: string) => unknown }) => {
      if (values?.link !== undefined) {
        return values.link(key);
      }
      return key;
    };
    return t;
  },
}));

vi.mock("next-intl/server", () => ({
  setRequestLocale: vi.fn(),
}));
