import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "../requests/blogs";
import Blog from "./Blog";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";

const BlogList = () => {
  const blogFormRef = useRef();

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  if (result.isError) {
    return <div>blog service not available due to server problems</div>;
  }

  const blogs = result.data.sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm />
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
