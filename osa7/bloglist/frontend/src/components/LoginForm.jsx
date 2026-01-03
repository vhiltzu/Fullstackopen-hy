import { useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { login } from "../requests/login";

import UserContext from "../context/UserContext";
import NotificationContext from "../context/NotificationContext";

const LoginForm = () => {
  const { setErrorNotification, setSuccessNotification } =
    useContext(NotificationContext);
  const { userSession, setUserSession } = useContext(UserContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      setUserSession(user);

      setUsername("");
      setPassword("");

      setSuccessNotification(`Welcome ${user.name}`);
    },
    onError: () => {
      setErrorNotification("Wrong username or password");
    },
  });

  if (userSession) {
    // If already logged in, redirect to blogs page
    navigate("/");
    return null;
  }

  const handleLogin = (event) => {
    event.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <div>
      <h2>Log in to application</h2>
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
};

export default LoginForm;
