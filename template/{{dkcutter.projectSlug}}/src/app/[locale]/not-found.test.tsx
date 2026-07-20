import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PageNotFound from "./not-found";

describe("PageNotFound", () => {
  it("renders the PageError component with correct keys", () => {
    render(<PageNotFound />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("title");

    const description = screen.getByText("description");
    expect(description).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "backToHome" });
    expect(link).toHaveAttribute("href", "/");
  });
});
