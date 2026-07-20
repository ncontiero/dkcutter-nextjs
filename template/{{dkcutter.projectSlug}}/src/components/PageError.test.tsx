import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageError } from "./PageError";

describe("PageError", () => {
  it("renders the title and description", () => {
    render(<PageError title="Test Title" description="Test Description" />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Test Title");

    const description = screen.getByText("Test Description");
    expect(description).toBeInTheDocument();

{%- if dkcutter.i18n == "nextIntl" %}

    const link = screen.getByRole("link", { name: "backToHome" });
    expect(link).toHaveAttribute("href", "/");
{%- else %}

    const link = screen.getByRole("link", { name: /home/i });
    expect(link).toHaveAttribute("href", "/");
{%- endif %}
  });
});
