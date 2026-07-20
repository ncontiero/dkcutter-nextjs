import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PageNotFound from "./not-found";

describe("PageNotFound", () => {
  it("renders the PageError component with correct props", () => {
    render(<PageNotFound />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Page Not Found");

    const description = screen.getByText(
      "The page you are looking for does not exist.",
    );
    expect(description).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /home/i });
    expect(link).toHaveAttribute("href", "/");
  });
});
