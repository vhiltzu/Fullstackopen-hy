import { Box, Button, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import NotificationContext from "../context/NotificationContext";
import UserContext from "../context/UserContext";
import { login } from "../requests/login";

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
    <Box>
      <Typography variant="h5" gutterBottom>
        Log in to application
      </Typography>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            type="text"
            value={username}
            size="small"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            label="password"
            type="password"
            value={password}
            size="small"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div>
          <Button type="submit" color="primary" variant="contained">
            login
          </Button>
        </div>
      </form>
    </Box>
  );
};

export default LoginForm;
