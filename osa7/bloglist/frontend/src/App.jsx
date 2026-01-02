import { useContext, useState } from "react";
import { Routes, Route } from "react-router-dom";

import BlogList from "./components/BlogList";
import Users from "./components/Users";

import NotificationContext from "./context/NotificationContext";
import UserContext from "./context/UserContext";
import Notification from "./components/Notification";
import loginService from "./services/login";

const App = () => {
  const { setErrorNotification, setSuccessNotification } =
    useContext(NotificationContext);
  const { userSession, setUserSession, clearUserSession } =
    useContext(UserContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

      <Routes>
        <Route path="/users" element={<Users />} />
        <Route path="/" element={<BlogList />} />
      </Routes>
    </div>
  );
};

export default App;
