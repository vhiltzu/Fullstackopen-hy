import { List, ListItem, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRef, useContext } from "react";
import { Link } from "react-router-dom";

import UserContext from "../context/UserContext";
import { getBlogs } from "../requests/blogs";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";

const BlogList = () => {
  const { userSession } = useContext(UserContext);

  const blogFormRef = useRef();

  const blogs = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });

  if (blogs.isLoading) {
    return <div>loading data...</div>;
  }

  const sortedBlogs = blogs.data.sort((a, b) => b.likes - a.likes);
  return (
    <div>
      {userSession && (
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm />
        </Togglable>
      )}
      <List>
        {sortedBlogs.map((blog) => (
          <ListItem
            button
            key={blog.id}
            component={Link}
            to={`/blogs/${blog.id}`}
          >
            <Typography variant="body2">
              {blog.title} {blog.author}
            </Typography>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default BlogList;
