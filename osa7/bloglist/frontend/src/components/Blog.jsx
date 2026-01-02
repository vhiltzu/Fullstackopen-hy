import { useContext } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { likeBlog, deleteBlog } from "../requests/blogs";

import NotificationContext from "../context/NotificationContext";
import UserContext from "../context/UserContext";

const Blog = ({ isLoading, blog }) => {
  const { setErrorNotification, setSuccessNotification } =
    useContext(NotificationContext);
  const { userSession } = useContext(UserContext);

  const queryClient = useQueryClient();

  // Handler for liking a blog
  const blogLikeMutation = useMutation({
    mutationFn: likeBlog,
    onSuccess: (blog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      const updatedBlogs = blogs
        .map((b) => {
          // Update only the liked blog's likes count
          if (b.id === blog.id) {
            b.likes = blog.likes;
          }
          return b;
        })
        .sort((a, b) => b.likes - a.likes);

      queryClient.setQueryData(["blogs"], updatedBlogs);
      setSuccessNotification(`Blog '${blog.title}' liked successfully`);
    },
    onError: (error) => {
      setErrorNotification(error.message);
    },
  });

  // Handler for deleting a blog
  const blogDeleteMutation = useMutation({
    mutationFn: deleteBlog,
    // No response data expected on deletion so use the passed blog object
    onSuccess: (_, blog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      const updatedBlogs = blogs
        .filter((b) => b.id !== blog.id)
        .sort((a, b) => b.likes - a.likes);

      queryClient.setQueryData(["blogs"], updatedBlogs);
      setSuccessNotification(`Blog '${blog.title}' deleted successfully`);
    },
    onError: (error) => {
      setErrorNotification(error.message);
    },
  });

  if (isLoading) {
    return <div>loading blog...</div>;
  }

  const canRemove =
    userSession && blog.user && userSession.username === blog.user.username;

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div className="blogDetails">
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}{" "}
          <button type="button" onClick={() => blogLikeMutation.mutate(blog)}>
            like
          </button>
        </div>
        <div>{blog.user && blog.user.name}</div>
        {canRemove && (
          <button type="button" onClick={() => blogDeleteMutation.mutate(blog)}>
            remove
          </button>
        )}
      </div>
    </div>
  );
};

export default Blog;
