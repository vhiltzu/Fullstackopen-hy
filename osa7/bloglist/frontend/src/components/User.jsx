import { useEffect, useContext } from "react";

import NotificationContext from "../context/NotificationContext";

const User = ({ isLoading, user }) => {
  const { setErrorNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (!isLoading && !user) {
      setErrorNotification("User not found");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div>
        <p>loading user...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
