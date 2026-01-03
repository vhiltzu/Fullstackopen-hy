import { Container, ThemeProvider, createTheme } from "@mui/material";
import { Routes, Route, useMatch } from "react-router-dom";

import Blog from "./components/Blog";
import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
import Navigation from "./components/Navigation";
import Notification from "./components/Notification";
import User from "./components/User";
import Users from "./components/Users";

const App = () => {
  const userId = useMatch("/users/:id");
  const blogId = useMatch("/blogs/:id");

  const theme = createTheme({
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      <Container>
        <Navigation />
        <Notification />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/users/:id"
            element={<User id={userId ? userId.params.id : null} />}
          />
          <Route path="/users" element={<Users />} />
          <Route
            path="/blogs/:id"
            element={<Blog id={blogId ? blogId.params.id : null} />}
          />
          <Route path="/" element={<BlogList />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
};

export default App;
