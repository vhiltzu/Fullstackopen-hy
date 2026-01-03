import { useContext } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

import { getBlogById, likeBlog, deleteBlog } from "../requests/blogs";

import NotificationContext from "../context/NotificationContext";
import UserContext from "../context/UserContext";

const Blog = ({ id }) => {
  const { setErrorNotification, setSuccessNotification } =
    useContext(NotificationContext);
  const { userSession } = useContext(UserContext);

  const queryClient = useQueryClient();

  // Handler for liking a blog
  const blog = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id),
    onError: (error) => {
      setErrorNotification(error.message);
    },
  });

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

  if (blog.isLoading) {
    return <div>loading blog...</div>;
  }

  const canRemove =
    userSession &&
    blog.data.user &&
    userSession.username === blog.data.user.username;

  return (
    <div>
      <h2>
        {blog.data.title} {blog.data.author}
      </h2>
      <div className="blogDetails">
        <div>{blog.data.url}</div>
        <div>
          likes {blog.data.likes}{" "}
          <button
            type="button"
            onClick={() => blogLikeMutation.mutate(blog.data)}
          >
            like
          </button>
        </div>
        <div>{blog.data.user && blog.data.user.name}</div>
        {canRemove && (
          <button
            type="button"
            onClick={() => blogDeleteMutation.mutate(blog.data)}
          >
            remove
          </button>
        )}
      </div>
      <div className="blogComments">
        <h3>comments</h3>
        <ul>
          {blog.data.comments &&
            blog.data.comments.map((comment, index) => (
              <li key={index}>{comment}</li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Blog;
