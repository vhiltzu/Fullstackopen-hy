import { useState, useContext } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import NotificationContext from "../context/NotificationContext";
import { createBlog } from "../requests/blogs";

function BlogForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const { setErrorNotification, setSuccessNotification } = useContext(NotificationContext)
  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: (blog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(blog))
      setSuccessNotification(`A new blog '${blog.title}' by ${blog.author} added`)
    },
    onError: (error) => {
      setErrorNotification(error.message)
    }
  })

  // Handler for adding a new blog
  const handleSubmit = (event) => {
    event.preventDefault();

    newBlogMutation.mutate({
      title,
      author,
      url,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">author:</label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <label htmlFor="url">url:</label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
}

export default BlogForm;
