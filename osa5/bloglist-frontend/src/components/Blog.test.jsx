import { render, screen } from "@testing-library/react";
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
