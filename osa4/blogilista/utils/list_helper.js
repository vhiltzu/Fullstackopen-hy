const dummy = (_blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  // Sum the likes of all blogs
  const sumLikes = (sum, blog) => sum + blog.likes;

  return blogs.reduce(sumLikes, 0);
};

const favoriteBlog = (blogs) => {
  // Find the blog with the most likes
  // That is the favorite blog
  const mostLiked = (max, blog) => (blog.likes > max.likes ? blog : max);

  return blogs.reduce(mostLiked, blogs[0]);
};

const mostBlogs = (blogs) => {
  const incrementCountForAuthor = (counts, blog) => {
    return { ...counts, [blog.author]: (counts[blog.author] || 0) + 1 };
  };

  // Count number of blogs for each author
  const authorBlogCount = blogs.reduce(incrementCountForAuthor, {});

  // Find the maximum count of blogs
  const maxCountAuthor = Math.max(...Object.values(authorBlogCount));

  // Find the author with the maximum count of blogs
  const authorWithMostBlogs = Object.entries(authorBlogCount).find(
    ([_, count]) => count === maxCountAuthor
  );

  // If no author found, return undefined
  if (!authorWithMostBlogs) {
    return undefined;
  }

  return {
    author: authorWithMostBlogs[0],
    blogs: maxCountAuthor,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
