import { Box, Button, List, ListItem, Typography } from "@mui/material";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Link } from "react-router-dom";

import NotificationContext from "../context/NotificationContext";
import UserContext from "../context/UserContext";
import { getBlogById, likeBlog, deleteBlog } from "../requests/blogs";
import BlogCommentForm from "./BlogCommentForm";
import Togglable from "./Togglable";

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

  if (!blog.data) {
    return (
      <Box>
        <Alert severity="error">Blog not found</Alert>
      </Box>
    );
  }

  const canRemove =
    userSession &&
    blog.data.user &&
    userSession.username === blog.data.user.username;

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        {blog.data.title} {blog.data.author}
      </Typography>
      <div className="blogDetails">
        <div>
          <Link to={blog.data.url}>
            <Typography variant="body1">{blog.data.url}</Typography>
          </Link>
        </div>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1">likes {blog.data.likes} </Typography>
          <Button
            size="small"
            type="button"
            variant="text"
            onClick={() => blogLikeMutation.mutate(blog.data)}
          >
            like
          </Button>
        </Box>
        <Box>
          <Typography variant="body1">
            {blog.data.user && blog.data.user.name}
          </Typography>
        </Box>
        {canRemove && (
          <Button
            size="small"
            type="button"
            onClick={() => blogDeleteMutation.mutate(blog.data)}
          >
            remove
          </Button>
        )}
      </div>
      <div className="blogComments">
        <Typography variant="h6" gutterBottom>
          comments
        </Typography>
        <Togglable buttonLabel="add comment">
          <BlogCommentForm blogId={blog.data.id} />
        </Togglable>
        <List>
          {blog.data.comments &&
            blog.data.comments.map((comment, index) => (
              <ListItem key={index}>
                <Typography variant="body2">{comment}</Typography>
              </ListItem>
            ))}
        </List>
      </div>
    </div>
  );
};

export default Blog;
