import { expect, test } from "@playwright/test";

test.describe("Not Found Page (E2E)", () => {
{%- if dkcutter.i18n == "nextIntl" %}
  test("renders localized 404 page for unknown routes inside a locale", async ({
    page,
  }) => {
    const response = await page.goto("/en/this-route-does-not-exist");

    expect(response?.status()).toBe(404);

    const heading = page.getByRole("heading", { name: "Page Not Found" });
    await expect(heading).toBeVisible();

    const description = page.getByText(
      "The page you are looking for does not exist.",
    );
    await expect(description).toBeVisible();

    const homeLink = page.getByRole("link", { name: "home" });
    await expect(homeLink).toBeVisible();
  });

  test("redirects unknown routes in root to the default locale 404", async ({
    page,
  }) => {
    await page.goto("/this-route-does-not-exist");

    await expect(page).toHaveURL("/en/this-route-does-not-exist");

    const heading = page.getByRole("heading", { name: "Page Not Found" });
    await expect(heading).toBeVisible();
  });
{%- else %}
  test("renders 404 page for unknown routes", async ({ page }) => {
    // Navigate to a route that definitely doesn't exist
    const response = await page.goto("/this-route-does-not-exist");

    // Check if the response status is 404
    expect(response?.status()).toBe(404);

    // Verify the title
    const heading = page.getByRole("heading", { name: "Page Not Found" });
    await expect(heading).toBeVisible();

    // Verify the description
    const description = page.getByText(
      "The page you are looking for does not exist.",
    );
    await expect(description).toBeVisible();

    // Verify the link back to home exists
    const homeLink = page.getByRole("link", { name: /home/i });
    await expect(homeLink).toBeVisible();
  });
{%- endif %}
});
