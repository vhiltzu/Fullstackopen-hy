import { Routes, Route, useMatch } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getUsers } from "./requests/users";

import Notification from "./components/Notification";

import Blog from "./components/Blog";
import BlogList from "./components/BlogList";
import User from "./components/User";
import Users from "./components/Users";
import Navigation from "./components/Navigation";
import LoginForm from "./components/LoginForm";

const App = () => {
  const userId = useMatch("/users/:id");
  const blogId = useMatch("/blogs/:id");

  const userResult = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const getUserById = () => {
    if (!userId || !userResult.isSuccess) {
      return null;
    }

    return userResult.data.find((user) => user.id === userId.params.id);
  };

  return (
    <div>
      <Navigation />
      <h2>blog app</h2>
      <Notification />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/users/:id"
          element={
            <User isLoading={userResult.isLoading} user={getUserById()} />
          }
        />
        <Route
          path="/users"
          element={
            <Users isLoading={userResult.isLoading} users={userResult.data} />
          }
        />
        <Route
          path="/blogs/:id"
          element={<Blog id={blogId ? blogId.params.id : null} />}
        />
        <Route path="/" element={<BlogList />} />
      </Routes>
    </div>
  );
};

export default App;
