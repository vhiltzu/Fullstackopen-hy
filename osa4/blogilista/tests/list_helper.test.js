const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const { initialBlogs: blogs, mostLikedBlog, listWithOneBlog } = require("./test_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("when list has only one blog equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("when list has multiple blogs the likes are summed correctly", () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36);
  });

  test("when list is empty equals zero", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });
});

describe("favorites", () => {
  test("when list has only one blog equals the favorite of that", () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    assert.deepStrictEqual(result, listWithOneBlog[0]);
  });

  test("when list has multiple blogs the favorite is found correctly by using likes", () => {
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, mostLikedBlog);
  });

  // There could be a corner case test for multiple favorites with same likes.
  // The requirements of the exercise do not require handling that case though.

  test("when list is empty equals undefined", () => {
    const result = listHelper.favoriteBlog([]);
    assert.deepStrictEqual(result, undefined);
  });
});

describe("most blogs", () => {
  test("when list has only one blog equals the author of that", () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", blogs: 1 });
  });

  test("when list has multiple blogs the author with most blogs is found correctly", () => {
    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, { author: "Robert C. Martin", blogs: 3 });
  });

  // There could be a corner case test for multiple top authors with same blog count.
  // The requirements of the exercise do not require handling that case though.

  test("when list is empty equals undefined", () => {
    const result = listHelper.mostBlogs([]);
    assert.deepStrictEqual(result, undefined);
  });
});

describe("most likes", () => {
  test("when list has only one blog equals the author of that", () => {
    const result = listHelper.mostLikes(listWithOneBlog);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 5 });
  });

  test("when list has multiple blogs the author with most likes is found correctly", () => {
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 17 });
  });

  // There could be a corner case test for multiple top authors with same likes.
  // The requirements of the exercise do not require handling that case though.

  test("when list is empty equals undefined", () => {
    const result = listHelper.mostLikes([]);
    assert.deepStrictEqual(result, undefined);
  });
});