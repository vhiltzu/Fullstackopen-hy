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
    "Component testing is done with react-testing-library Testing Library",
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

  // Reveal details
  const button = screen.getByText("view");
  await events.click(button);

  const urlElement = screen.getByText("http://localhost:3000");
  expect(urlElement).toBeDefined();
  const likesElement = screen.getByText("likes 5");
  expect(likesElement).toBeDefined();
});

test("calls event handler twice when like button is clicked twice", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Testing Library",
    url: "http://localhost:3000",
    likes: 5,
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog} onLikeClick={mockHandler} />);
  const events = userEvent.setup();

  // Reveal details first
  const viewButton = screen.getByText("view");
  await events.click(viewButton);

  // Click like button twice
  const likeButton = screen.getByText("like");
  await events.click(likeButton);
  await events.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
