import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders only title and author", () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Testing Library",
    url: "http://localhost:3000",
    likes: 5,
  };

  render(<Blog blog={blog} />);

  const titleElement = screen.getByText(
    "Component testing is done with react-testing-library Testing Library"
  );
  expect(titleElement).toBeDefined();

  const urlElement = screen.queryByText("http://localhost:3000");
  expect(urlElement).toBeNull();
  const likesElement = screen.queryByText("likes 5");
  expect(likesElement).toBeNull();
});

test("renders url and likes when view button is clicked", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Testing Library",
    url: "http://localhost:3000",
    likes: 5,
  };

  render(<Blog blog={blog} />);
  const events = userEvent.setup();

  const button = screen.getByText("view");
  await events.click(button);

  const urlElement = screen.getByText("http://localhost:3000");
  expect(urlElement).toBeDefined();
  const likesElement = screen.getByText("likes 5");
  expect(likesElement).toBeDefined();
});