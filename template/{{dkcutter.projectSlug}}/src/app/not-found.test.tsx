import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PageNotFound from "./not-found";

describe("PageNotFound", () => {
  it("renders the PageError component with correct props", () => {
    render(<PageNotFound />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Page Not Found" }),
    ).toBeDefined();
    expect(
      screen.getByText("The page you are looking for does not exist."),
    ).toBeDefined();
    expect(screen.getByRole("link", { name: /home/i })).toBeDefined();
  });
});
