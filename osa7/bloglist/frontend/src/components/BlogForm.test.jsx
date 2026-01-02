import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("calls createBlog with correct details when a new blog is created", async () => {
  const mockCreateBlog = vi.fn();

  render(<BlogForm createBlog={mockCreateBlog} />);
  const events = userEvent.setup();

  // Find input fields and button
  const titleInput = screen.getByLabelText("title:");
  const authorInput = screen.getByLabelText("author:");
  const urlInput = screen.getByLabelText("url:");
  const createButton = screen.getByText("create");

  // Simulate user input and form submission
  await events.type(titleInput, "Testing React Forms");
  await events.type(authorInput, "Test Author");
  await events.type(urlInput, "http://testurl.com");
  await events.click(createButton);

  // Verify that createBlog was called with correct data
  expect(mockCreateBlog).toHaveBeenCalledTimes(1);
  expect(mockCreateBlog).toHaveBeenCalledWith({
    title: "Testing React Forms",
    author: "Test Author",
    url: "http://testurl.com",
  });
});
