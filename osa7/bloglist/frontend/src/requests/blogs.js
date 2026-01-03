const baseUrl = "/api/blogs";

let token = null;

export const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

export const getBlogs = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch blogs')
  }

  return await response.json()
};

export const getBlogById = async (id) => {
  const response = await fetch(`${baseUrl}/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch blog')
  }

  return await response.json();
};

export const createBlog = async (newBlog) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify(newBlog)
  }

  const response = await fetch(baseUrl, options)

  if (!response.ok) {
    throw new Error('Failed to create blog')
  }

  return await response.json()
};

export const commentBlog = async (newComment) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify({ comment: newComment.comment })
  }

  const response = await fetch(`${baseUrl}/${newComment.id}/comments`, options)

  if (!response.ok) {
    throw new Error('Failed to create blog')
  }

  return await response.json()
};

export const likeBlog = async (blog) => {
  const updatedBlog = { ...blog, likes: blog.likes + 1 };

  if (blog.user) {
    updatedBlog.user = blog.user.id;
  }

  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBlog),
  }

  const response = await fetch(`${baseUrl}/${updatedBlog.id}`, options)

  if (!response.ok) {
    throw new Error('Failed to vote blog')
  }

  return await response.json()
}

export const deleteBlog = async (blog) => {
  const config = {
    method: "DELETE",
    headers: { Authorization: token },
  };
  const request = fetch(`${baseUrl}/${blog.id}`, config);
  const response = await request;

  return response.data;
};
