import { useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getBlogs } from "../requests/blogs";

import BlogForm from "./BlogForm";
import Togglable from "./Togglable";

const BlogList = () => {
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
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm />
      </Togglable>
      {sortedBlogs.map((blog) => (
        <BlogListItem key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

const BlogListItem = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle} className="blog">
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
    </div>
  );
};

export default BlogList;
