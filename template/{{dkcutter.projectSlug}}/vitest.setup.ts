import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

{%- if dkcutter.i18n == "nextIntl" %}

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
{%- endif %}

afterEach(() => {
  // Clear the DOM between the tests (remove what was rendered)
  cleanup();

  // Resets all Vitest spies and mocks (`vi.fn`, `vi.spyOn`, etc.).
  // Ensures that tests are independent and free of "garbage" from previous executions.
  vi.resetAllMocks();
});
