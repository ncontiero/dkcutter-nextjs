import { expect, test } from "@playwright/test";

test.describe("Home Page (E2E)", () => {
{%- if dkcutter.i18n == "nextIntl" %}
  test("redirects to default locale and renders translated heading", async ({
    page,
  }) => {
    await page.goto("/");

    // Checks the next-intl automatic redirection
    await expect(page).toHaveURL("/en");

    // Checks for language injection in the HTML
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "en");

    // Check if the translation has been loaded
    const heading = page.getByRole("heading", { name: "Hello World" });
    await expect(heading).toBeVisible();
  });
{%- else %}
  test("renders heading with Hello World", async ({ page }) => {
    await page.goto("/");

    const heading = page.getByRole("heading", { name: "Hello World" });
    await expect(heading).toBeVisible();
  });
{%- endif %}
});
