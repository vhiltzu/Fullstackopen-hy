const loginWith = async (page, username, password, name) => {
  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
  await page.getByText(`${name} logged in`).waitFor();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "create new blog" }).click();
  await page.getByLabel("title:").fill(title);
  await page.getByLabel("author:").fill(author);
  await page.getByLabel("url:").fill(url);
  await page.getByRole("button", { name: "create" }).click();
  await page.getByText(`${title} ${author}`).waitFor();
};

// Like the blogs to set different like counts
const likeBlog = async (page, blogTitle, likes) => {
    // Expand blog details
    await page
    .getByText(blogTitle)
    .getByRole("button", { name: "view" })
    .click();

    for (let i = 0; i < likes; i++) {
    await page
        .getByText(/likes \d+/)
        .getByRole("button", { name: "like" })
        .click();
    await page.getByText(`likes ${i + 1}`).waitFor();
    }

    // Hide blog details
    await page
    .getByText(blogTitle)
    .getByRole("button", { name: "hide" })
    .click();
};

export { loginWith, createBlog, likeBlog };
