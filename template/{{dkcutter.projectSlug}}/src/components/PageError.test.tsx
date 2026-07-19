import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageError } from "./PageError";

describe("PageError", () => {
  it("renders the title and description", () => {
    render(<PageError title="Test Title" description="Test Description" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Test Title" }),
    ).toBeDefined();
    expect(screen.getByText("Test Description")).toBeDefined();
{%- if dkcutter.i18n == "nextIntl" %}
    expect(screen.getByRole("link", { name: "backToHome" })).toBeDefined();
{%- else %}
    expect(screen.getByRole("link", { name: /home/i })).toBeDefined();
{%- endif %}
  });
});
