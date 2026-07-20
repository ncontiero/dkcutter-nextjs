import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import HomePage from "./page";

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    use: () => ({ locale: "en" }),
  };
});

describe("HomePage", () => {
  it("renders a heading with title key", () => {
    render(
      <HomePage
        params={Promise.resolve({ locale: "en" })}
        searchParams={Promise.resolve({ test: "test" })}
      />,
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("title");
  });
});
