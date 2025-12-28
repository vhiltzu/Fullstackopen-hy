const { test, expect, beforeEach, describe } = require("@playwright/test");
const helpers = require("./helpers");

const user = {
  name: "Matti Luukkainen",
  username: "mluukkai",
  password: "salainen",
};

const anotherUser = {
  name: "John Doe",
  username: "john",
  password: "secret",
};

const blog = {
  title: "E2E testing with Playwright",
  author: "Test Author",
  url: "http://example.com",
};

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: user,
    });
    await request.post("http://localhost:3003/api/users", {
      data: anotherUser,
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("Log in to application")).toBeVisible();
    await expect(page.getByLabel("username")).toBeVisible();
    await expect(page.getByLabel("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await helpers.loginWith(page, user.username, user.password, user.name);

      await expect(
        page.getByText("wrong username or password")
      ).not.toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByLabel("username").fill("mluukkai");
      await page.getByLabel("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("wrong username or password")).toBeVisible();
      await expect(page.getByText(`${user.name} logged in`)).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await helpers.loginWith(page, user.username, user.password, user.name);
    });

    test("a new blog can be created", async ({ page }) => {
      await helpers.createBlog(page, blog.title, blog.author, blog.url);

      // Verify that the notification appears
      await expect(
        page.getByText(`A new blog "${blog.title}" by ${blog.author} added`)
      ).toBeVisible();

      // Verify that the new blog appears in the blog list
      await expect(
        page.getByText(`${blog.title} ${blog.author}`)
      ).toBeVisible();
    });

    describe("and when a blog exists", () => {
      beforeEach(async ({ page }) => {
        await helpers.createBlog(page, blog.title, blog.author, blog.url);
      });

      test("user can like a blog", async ({ page }) => {
        // Expand blog details
        await page
          .getByText(`${blog.title} ${blog.author}`)
          .getByRole("button", { name: "view" })
          .click();

        // Like the blog
        await page
          .getByText("likes 0")
          .getByRole("button", { name: "like" })
          .click();

        // Verify that the like count has increased
        await expect(page.getByText("likes 1")).toBeVisible();
      });

      test("user can remove a blog", async ({ page }) => {
        // Expand blog details
        await page
          .getByText(`${blog.title} ${blog.author}`)
          .getByRole("button", { name: "view" })
          .click();

        // Remove the blog
        page.on("dialog", (dialog) => dialog.accept());
        await page.getByRole("button", { name: "remove" }).click();

        // Verify that the blog has been removed
        await expect(
          page.getByText(`${blog.title} ${blog.author}`)
        ).not.toBeVisible();
      });

      test("only the creator can see the remove button", async ({ page }) => {
        // Logout current user
        await page.getByRole("button", { name: "logout" }).click();

        // Login as another user
        await helpers.loginWith(
          page,
          anotherUser.username,
          anotherUser.password,
          anotherUser.name
        );

        // Expand blog details
        await page
          .getByText(`${blog.title} ${blog.author}`)
          .getByRole("button", { name: "view" })
          .click();

        // Verify that the remove button is not visible
        await expect(
          page.getByRole("button", { name: "remove" })
        ).not.toBeVisible();
      });
    });
  });
});
