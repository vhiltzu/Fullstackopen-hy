import { Alert, Box, List, ListItem, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Link } from "react-router-dom";

import NotificationContext from "../context/NotificationContext";
import { getUserById } from "../requests/users";

const User = ({ id }) => {
  const { setErrorNotification } = useContext(NotificationContext);

  const userResult = useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id),
    onError: (error) => {
      setErrorNotification(error.message);
    },
  });

  if (userResult.isLoading) {
    return (
      <Box>
        <Typography>loading user...</Typography>
      </Box>
    );
  }

  if (!userResult.data) {
    return (
      <Box>
        <Alert severity="error">User not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {userResult.data.name}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Added blogs
      </Typography>
      <List>
        {userResult.data.blogs.map((blog) => (
          <ListItem component={Link} to={`/blogs/${blog.id}`} key={blog.id}>
            <Typography variant="body2">{blog.title}</Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default User;
