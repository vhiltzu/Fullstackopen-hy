import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  const [notification, setNotification] = useState({
    message: null,
    kind: null,
  })

  useEffect(() => {
    blogService.getAll().then((blogs) => setSortedBlogs(blogs))
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')

    if (!loggedUserJSON) {
      return
    }

    const user = JSON.parse(loggedUserJSON)
    setUser(user)
    blogService.setToken(user.token)
  }, [])

  const setSortedBlogs = (blogs) => {
    const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
    setBlogs(sortedBlogs)
  }

  const handleLogin = (event) => {
    event.preventDefault()

    loginService
      .login(username, password)
      .then((user) => {
        localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
        setUser(user)
        blogService.setToken(user.token)

        setUsername('')
        setPassword('')

        setNotification({ message: `Welcome ${user.name}`, kind: 'success' })
      })
      .catch(() => {
        setNotification({
          message: 'Wrong username or password',
          kind: 'error',
        })
      })
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    localStorage.removeItem('loggedBlogAppUser')
    setNotification({ message: 'Logged out successfully', kind: 'success' })
  }

  const handleNewBlogCreation = (blogObject) => {
    blogService.create(blogObject).then((returnedBlog) => {
      blogFormRef.current.toggleVisibility()
      setSortedBlogs(blogs.concat(returnedBlog))
      setNotification({
        message: `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`,
        kind: 'success',
      })
    })
  }

  const handleBlogLike = (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }

    // Make sure the user field is just the user id
    if (blog.user && blog.user.id) {
      updatedBlog.user = blog.user.id
    }
    blogService.update(blog.id, updatedBlog).then((returnedBlog) => {
      const updatedBlogs = [...blogs]

      // Find index of the updated blog and replace it likes instead of the whole object
      const i = blogs.findIndex((b) => b.id === blog.id)
      updatedBlogs[i].likes = returnedBlog.likes

      setSortedBlogs(updatedBlogs)
    })
  }

  const handleBlogRemove = (blog) => {
    const blogToRemove = blogs.find((b) => b.id === blog.id)

    if (
      window.confirm(
        `Remove blog "${blogToRemove.title}" by ${blogToRemove.author}?`
      )
    ) {
      blogService.remove(blog.id).then(() => {
        const updatedBlogs = blogs.filter((b) => b.id !== blog.id)
        setSortedBlogs(updatedBlogs)
        setNotification({
          message: `Blog "${blogToRemove.title}" removed`,
          kind: 'success',
        })
      })
    }
  }

  const handleNotificationDismiss = () => {
    setNotification({ message: null, kind: null })
  }

  // Show login form if user is not logged in
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification
          message={notification.message}
          kind={notification.kind}
          dismiss={handleNotificationDismiss}
        />
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification
        message={notification.message}
        kind={notification.kind}
        dismiss={handleNotificationDismiss}
      />
      <p>
        {user.name} logged in{' '}
        <button type="button" onClick={handleLogout}>
          logout
        </button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleNewBlogCreation} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          canRemove={user.username === blog.user?.username} // Because there is no id matching available due lack of properties
          onLikeClick={handleBlogLike}
          onRemove={handleBlogRemove}
        />
      ))}
    </div>
  )
}

export default App
