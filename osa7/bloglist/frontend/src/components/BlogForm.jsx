import { Box, Button, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";

import NotificationContext from "../context/NotificationContext";
import { createBlog } from "../requests/blogs";

function BlogForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const { setErrorNotification, setSuccessNotification } =
    useContext(NotificationContext);
  const queryClient = useQueryClient();

  const newBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: (blog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(blog));
      setSuccessNotification(
        `A new blog '${blog.title}' by ${blog.author} added`
      );
    },
    onError: (error) => {
      setErrorNotification(error.message);
    },
  });

  // Handler for adding a new blog
  const handleSubmit = (event) => {
    event.preventDefault();

    newBlogMutation.mutate({
      title,
      author,
      url,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <Box>
      <h2>Create a new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            id="title"
            label="title"
            type="text"
            value={title}
            size="small"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <TextField
            id="author"
            label="author"
            type="text"
            value={author}
            size="small"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            id="url"
            label="url"
            type="text"
            value={url}
            size="small"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <Button size="small" type="submit">
          create
        </Button>
      </form>
    </Box>
  );
}

export default BlogForm;
