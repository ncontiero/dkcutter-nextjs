import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PageNotFound from "./not-found";

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

describe("PageNotFound", () => {
  it("renders the PageError component with correct keys", () => {
    render(<PageNotFound />);

    expect(
      screen.getByRole("heading", { level: 1, name: "title" }),
    ).toBeDefined();
    expect(screen.getByText("description")).toBeDefined();
    expect(screen.getByRole("link", { name: "backToHome" })).toBeDefined();
  });
});
