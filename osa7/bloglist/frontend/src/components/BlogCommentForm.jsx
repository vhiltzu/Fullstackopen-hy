import { Button, TextField, Box } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";

import NotificationContext from "../context/NotificationContext";
import { commentBlog } from "../requests/blogs";

function BlogCommentForm({ blogId }) {
  const [comment, setComment] = useState("");

  const { setErrorNotification, setSuccessNotification } =
    useContext(NotificationContext);
  const queryClient = useQueryClient();

  const newCommentMutation = useMutation({
    mutationFn: commentBlog,
    onSuccess: (blog) => {
      queryClient.setQueryData(["blog", blog.id], blog);
      setSuccessNotification(`A new comment added`);
    },
    onError: (error) => {
      setErrorNotification(error.message);
    },
  });

  // Handler for adding a new blog
  const handleSubmit = (event) => {
    event.preventDefault();

    newCommentMutation.mutate({
      comment,
      id: blogId,
    });

    setComment("");
  };

  return (
    <Box>
      <h2>Add a new comment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            id="comment"
            label="comment"
            type="text"
            value={comment}
            size="small"
            onChange={({ target }) => setComment(target.value)}
          />
        </div>
        <Button size="small" type="submit">
          send
        </Button>
      </form>
    </Box>
  );
}

export default BlogCommentForm;
