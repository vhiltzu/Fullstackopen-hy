import { useState, useContext } from "react";
import { useQueryClient, useMutation } from '@tanstack/react-query'
import NotificationContext from "../context/NotificationContext";
import UserContext from "../context/UserContext";
import { likeBlog, deleteBlog } from "../requests/blogs";

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const [detailsVisible, setDetailsVisible] = useState(false);

  const { setErrorNotification, setSuccessNotification } = useContext(NotificationContext)
  const { userSession } = useContext(UserContext)

  const queryClient = useQueryClient()

  // Handler for liking a blog
  const blogLikeMutation = useMutation({
    mutationFn: likeBlog,
    onSuccess: (blog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      const updatedBlogs = blogs.map(b => {
        // Update only the liked blog's likes count
        if (b.id === blog.id) {
          b.likes = blog.likes
        }
        return b
      }).sort((a, b) => b.likes - a.likes)

      queryClient.setQueryData(['blogs'], updatedBlogs)
      setSuccessNotification(`Blog '${blog.title}' liked successfully`)
    },
    onError: (error) => {
      setErrorNotification(error.message)
    }
  })

  // Handler for deleting a blog
  const blogDeleteMutation = useMutation({
    mutationFn: deleteBlog,
    // No response data expected on deletion so use the passed blog object
    onSuccess: (_, blog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      const updatedBlogs = blogs.filter(b => b.id !== blog.id).sort((a, b) => b.likes - a.likes)

      queryClient.setQueryData(['blogs'], updatedBlogs)
      setSuccessNotification(`Blog '${blog.title}' deleted successfully`)
    },
    onError: (error) => {
      setErrorNotification(error.message)
    },
  })

  const toggleDetailsVisibility = () => {
    setDetailsVisible(!detailsVisible);
  };

  const canRemove = userSession && blog.user && (userSession.username === blog.user.username);

  if (detailsVisible === false) {
    return (
      <div style={blogStyle} className="blog">
        {blog.title} {blog.author}
        <button type="button" onClick={toggleDetailsVisibility}>
          view
        </button>
      </div>
    );
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button type="button" onClick={toggleDetailsVisibility}>
        hide
      </button>
      <div className="blogDetails">
        <p>{blog.url}</p>
        <p>
          likes {blog.likes}{" "}
          <button type="button" onClick={() => blogLikeMutation.mutate(blog)}>
            like
          </button>
        </p>
        <p>{blog.user && blog.user.name}</p>
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
