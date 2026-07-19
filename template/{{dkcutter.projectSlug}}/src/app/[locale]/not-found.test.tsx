import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PageNotFound from "./not-found";

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
