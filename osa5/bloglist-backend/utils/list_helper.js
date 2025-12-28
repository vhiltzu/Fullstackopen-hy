const dummy = (_blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  // Sum the likes of all blogs
  const sumLikes = (sum, blog) => sum + blog.likes

  return blogs.reduce(sumLikes, 0)
}

const favoriteBlog = (blogs) => {
  // Find the blog with the most likes
  // That is the favorite blog
  const mostLiked = (max, blog) => (blog.likes > max.likes ? blog : max)

  return blogs.reduce(mostLiked, blogs[0])
}

// Helper function to find author with most blogs
const findTopAuthor = (blogsByAuthor) => {
  // Find the maximum count of blogs
  const maxCountAuthor = Math.max(...Object.values(blogsByAuthor))

  // Find the author with the maximum count of blogs
  return Object.entries(blogsByAuthor).find(
    (blogAuthorPair) => blogAuthorPair[1] === maxCountAuthor
  )
}

const mostBlogs = (blogs) => {
  const incrementCountForAuthor = (counts, blog) => {
    return { ...counts, [blog.author]: (counts[blog.author] || 0) + 1 }
  }

  // Count number of blogs for each author
  const authorBlogCount = blogs.reduce(incrementCountForAuthor, {})

  // Find the author with the most blogs
  const topAuthor = findTopAuthor(authorBlogCount)

  // If no author found, return undefined
  if (!topAuthor) {
    return undefined
  }

  return {
    author: topAuthor[0],
    blogs: topAuthor[1],
  }
}

const mostLikes = (blogs) => {
  const addLikesForAuthor = (likesCount, blog) => {
    return {
      ...likesCount,
      [blog.author]: (likesCount[blog.author] || 0) + blog.likes,
    }
  }

  // Sum likes for each author
  const authorLikesCount = blogs.reduce(addLikesForAuthor, {})

  // Find the author with the most liked blogs
  const topAuthor = findTopAuthor(authorLikesCount)

  // If no author found, return undefined
  if (!topAuthor) {
    return undefined
  }

  return {
    author: topAuthor[0],
    likes: topAuthor[1],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
