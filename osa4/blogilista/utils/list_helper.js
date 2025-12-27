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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
