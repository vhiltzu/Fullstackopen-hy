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

export { loginWith, createBlog };
