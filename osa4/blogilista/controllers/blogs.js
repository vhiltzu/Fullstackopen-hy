const blogsRouter = require('express').Router()
const Blog = require("../models/blog");
const helper = require("../utils/controller_helper");

blogsRouter.get("/", async (request, response) => {
  const blog = await Blog.find({}).populate("user");
  response.json(blog);
});

blogsRouter.post("/", async (request, response) => {
  const decodedToken = helper.decryptToken(helper.getTokenFrom(request));
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = await helper.findUserFromDecodedToken(decodedToken);

  if (!user) {
    return response.status(400).json({ error: "UserId missing or not valid" });
  }

  const blog = new Blog({ ...request.body, user: user._id });

  // Validate the blog data
  try {
    await blog.validate();
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }

  // Save the new blog to the database
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  // Attempt to delete the blog with the given ID
  try {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    response.status(404).end();
  }
});

blogsRouter.put("/:id", async (request, response) => {
  // Check if the blog with the given ID exists
  try {
    await Blog.findById(request.params.id);
  } catch (error) {
    return response.status(404).end();
  }

  // Validate the updated data
  try {
    await Blog.validate(request.body);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true, runValidators: true, context: "query" }
  );
  response.json(updatedBlog);
});

module.exports = blogsRouter
