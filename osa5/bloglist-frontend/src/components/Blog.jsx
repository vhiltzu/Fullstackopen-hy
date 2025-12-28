import { useState } from "react";

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const [detailsVisible, setDetailsVisible] = useState(false);

  const showDetailsWhenVisible = { display: detailsVisible ? "" : "none" };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button type="button" onClick={() => setDetailsVisible(!detailsVisible)}>
        {detailsVisible ? "hide" : "view"}
      </button>
      <div style={showDetailsWhenVisible} className="blogDetails">
        <p>{blog.url}</p>
        <p>
          likes {blog.likes} <button type="button">like</button>
        </p>
        <p>{blog.user && blog.user.name}</p>
      </div>
    </div>
  );
};

export default Blog;
