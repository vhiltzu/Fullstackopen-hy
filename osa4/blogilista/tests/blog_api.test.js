const { test, beforeEach, after, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { Blog } = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

describe("blog API tests", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test("returned blogs should have id, not _id", async () => {
    const response = await api.get("/api/blogs");

    // Check that none of the returned blogs have _id and all have id
    const hasInternalIds = response.body.some((e) => e._id);
    const hasExternalIds = response.body.every((e) => e.id);

    assert(!hasInternalIds);
    assert(hasExternalIds);
  });

  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "async/await simplifies making async calls",
      author: "Test Author",
      url: "http://example.com",
      likes: 8,
    };

    // Add the new blog
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    const contents = response.body.map((r) => r.title);

    // Verify that the blog count has increased by one
    assert.strictEqual(response.body.length, initialBlogs.length + 1);

    // Verify that the new blog is among the returned blogs
    assert(contents.includes("async/await simplifies making async calls"));
  });

  test("if likes property is missing, it defaults to 0", async () => {
    const newBlog = {
      title: "Blog without likes",
      author: "No Likes Author",
      url: "http://example.com/nolikes",
    };

    // Add the new blog
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    // Verify that the likes property defaults to 0
    assert.strictEqual(response.body.likes, 0);
  });

    test("blog without title and url is not added", async () => {
      const newBlog = {
        author: "Missing Fields Author",
        likes: 4,
      };

      // Attempt to add the invalid blog
      await api.post("/api/blogs").send(newBlog).expect(400);

      const response = await api.get("/api/blogs");

      // Verify that the blog count has not changed
      assert.strictEqual(response.body.length, initialBlogs.length);
    });
});

after(async () => {
  await mongoose.connection.close();
});
