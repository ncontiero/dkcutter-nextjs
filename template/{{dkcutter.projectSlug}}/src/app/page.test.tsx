import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders a heading with Hello World", () => {
    render(<HomePage />);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Hello World",
    });
    expect(heading).toBeDefined();
  });
});
