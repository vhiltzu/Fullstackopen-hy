const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { userExtractor } = require("../utils/middleware");

// CRUD operations for blogs
blogsRouter.get("/", async (request, response) => {
  const blog = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blog);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });

  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const user = request.user;

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
  savedBlog.populate("user", { username: 1, name: 1, id: 1 });

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  // Attempt to delete the blog with the given ID
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).end();
  }

  if (blog.user.toString() !== request.user.id) {
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
    request.body,
    { returnDocument: "after", runValidators: false },
  );

  response.json(updatedBlog);
});

// Comments endpoint
blogsRouter.post("/:id/comments", async (request, response) => {
  const { comment } = request.body;

  if (!comment || comment.trim() === "") {
    return response.status(400).json({ error: "Comment cannot be empty" });
  }

  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: "Blog not found" });
  }

  if (!blog.comments) {
    blog.comments = [];
  }
  
  blog.comments = blog.comments.concat(comment);
  const updatedBlog = await blog.save();

  response.status(201).json(updatedBlog);
});

module.exports = blogsRouter;
