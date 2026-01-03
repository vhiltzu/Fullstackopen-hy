import { Alert } from "@mui/material";
import { useContext } from "react";

import NotificationContext from "../context/NotificationContext";

const Notification = () => {
  const { notification } = useContext(NotificationContext);

  if (!notification) {
    return null;
  }

  if (notification.severity === "error") {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {notification.message}
      </Alert>
    );
  }

  if (notification.severity === "success") {
    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        {notification.message}
      </Alert>
    );
  }

  return null;
};

export default Notification;
