import { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
    <div>
      <h2>Add a new comment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="comment">comment:</label>
          <input
            id="comment"
            type="text"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </div>
        <button type="submit">send</button>
      </form>
    </div>
  );
}

export default BlogCommentForm;
