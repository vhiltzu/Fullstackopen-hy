import { useState } from 'react'

const Blog = ({ blog, canRemove, onLikeClick, onRemove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetailsVisibility = () => {
    setDetailsVisible(!detailsVisible);
  };

  const handleLikeClick = () => {
    onLikeClick(blog);
  };

  const handleRemoveClick = () => {
    onRemove(blog);
  };

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
          <button type="button" onClick={handleLikeClick}>
            like
          </button>
        </p>
        <p>{blog.user && blog.user.name}</p>
        {canRemove && (
          <button type="button" onClick={handleRemoveClick}>
            remove
          </button>
        )}
      </div>
    </div>
  );
}

export default Blog
