import { expect, test } from "@playwright/test";

const ADMIN_DEPLOY_URL = "https://intellismart-admin.netlify.app";
const ADMIN_LOCAL_URL = "http://localhost:5174";
const VALID_EMAIL = "admin@intellismart.in";
const VALID_PASSWORD = "admin123";

test.describe("consumer + admin sanity", () => {
  test("consumer footer shows representative copy and deploy link target", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Are you an IntelliSmart representative?")).toBeVisible();

    const adminPortalLink = page.getByRole("link", { name: "⚡ IntelliSmart Admin Portal →" });
    await expect(adminPortalLink).toHaveAttribute("href", ADMIN_DEPLOY_URL);
    await expect(adminPortalLink).toHaveAttribute("target", "_blank");
    await expect(adminPortalLink).toHaveAttribute("rel", /noopener/);
    await expect(adminPortalLink).toHaveAttribute("rel", /noreferrer/);
  });

  test("admin blocks dashboard when unauthenticated", async ({ page }) => {
    await page.goto(`${ADMIN_LOCAL_URL}/dashboard`);

    await expect(page).toHaveURL(`${ADMIN_LOCAL_URL}/`);
    await expect(page.getByRole("heading", { name: "IntelliSmart" })).toBeVisible();
    await expect(page.getByText("Operator Portal — Secure Access")).toBeVisible();
  });

  test("admin login error + successful login + sign out flow", async ({ page }) => {
    await page.goto(`${ADMIN_LOCAL_URL}/`);

    const emailInput = page.getByLabel("Operator email");
    const passwordInput = page.getByLabel("Operator password");
    const signInButton = page.getByRole("button", { name: "Sign In to Portal" });

    await emailInput.fill("wrong@intellismart.in");
    await passwordInput.fill("wrongpass");
    await signInButton.click();

    await expect(page.getByText("Access denied. Invalid credentials.")).toBeVisible();

    await emailInput.fill(VALID_EMAIL);
    await passwordInput.fill(VALID_PASSWORD);
    await signInButton.click();

    await expect(page).toHaveURL(`${ADMIN_LOCAL_URL}/dashboard`);
    await expect(page.getByText("Live · admin@intellismart.in")).toBeVisible();

    const signOutButton = page.getByRole("button", { name: "Sign Out" });
    await signOutButton.click();

    await expect(page).toHaveURL(`${ADMIN_LOCAL_URL}/`);
    await expect(page.getByRole("heading", { name: "IntelliSmart" })).toBeVisible();
  });
});
