import { render, screen } from "@testing-library/react";
{%- if dkcutter.i18n == "nextIntl" %}
import { describe, expect, it, vi } from "vitest";
{%- else %}
import { describe, expect, it } from "vitest";
{%- endif %}
import { PageError } from "./PageError";

{%- if dkcutter.i18n == "nextIntl" %}

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
{%- endif %}

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
