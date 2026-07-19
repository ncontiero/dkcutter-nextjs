import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PageNotFound from "./not-found";

vi.mock("next-intl", () => ({
  useTranslations: () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const t = (key: string) => key;
    t.rich = (key: string, values: any) => {
      if (values && values.link) {
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
