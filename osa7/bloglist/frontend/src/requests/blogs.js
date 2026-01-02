import axios from "axios";
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

export const likeBlog = async (blog) => {
  const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id };

  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBlog),
  }

  const response = await fetch(`${baseUrl}/${blog.id}`, options)

  if (!response.ok) {
    throw new Error('Failed to vote blog')
  }

  return await response.json()
}

export const deleteBlog = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.delete(`${baseUrl}/${blog.id}`, config);
  const response = await request;

  return response.data;
};
