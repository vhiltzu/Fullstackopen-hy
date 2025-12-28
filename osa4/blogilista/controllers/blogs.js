const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const helper = require("../utils/controller_helper");

blogsRouter.get("/", async (request, response) => {
  const blog = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blog);
});

blogsRouter.post("/", async (request, response) => {
  const decodedToken = helper.decryptToken(request);
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
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).end();
  }

  const decodedToken = helper.decryptToken(request);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  if (blog.user.toString() !== decodedToken.id) {
    return response
      .status(401)
      .json({ error: "only the creator can delete a blog" });
  }

  await Blog.findByIdAndDelete(request.params.id);

  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  // Check if the blog with the given ID exists
  try {
    await Blog.findById(request.params.id);
  } catch {
    return response.status(404).end();
  }

  // Validate the updated data
  try {
    await Blog.validate(request.body);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }

  delete request.body.id;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body
  );
  response.json(updatedBlog);
});

module.exports = blogsRouter;
