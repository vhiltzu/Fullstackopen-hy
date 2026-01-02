import { useContext, useState, useRef } from "react";
import { useQuery } from '@tanstack/react-query'
import NotificationContext from "./context/NotificationContext";
import UserContext from "./context/UserContext";
import { getBlogs } from "./requests/blogs";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import loginService from "./services/login";

const App = () => {
  const { setErrorNotification, setSuccessNotification } = useContext(NotificationContext);
  const { userSession, setUserSession, clearUserSession } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const blogFormRef = useRef();

  const result = useQuery(
    {
      queryKey: ['blogs'],
      queryFn: getBlogs,
      enabled: userSession !== null,
    },
  )

  const handleLogin = (event) => {
    event.preventDefault();

    loginService
      .login(username, password)
      .then((user) => {
        setUserSession(user);

        setUsername("");
        setPassword("");

        setSuccessNotification(`Welcome ${user.name}`);
      })
      .catch(() => {
        setErrorNotification("Wrong username or password");
      });
  };

  const handleLogout = () => {
    clearUserSession();
    setSuccessNotification("Logged out successfully");
  };

  // Show login form if user is not logged in
  if (userSession === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
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
    );
  }

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>blog service not available due to server problems</div>
  }

  const blogs = result.data.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {userSession.name} logged in{" "}
        <button type="button" onClick={handleLogout}>
          logout
        </button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          canRemove={userSession.username === blog.user?.username} // Because there is no id matching available due lack of properties
        />
      ))}
    </div>
  );
};

export default App;
