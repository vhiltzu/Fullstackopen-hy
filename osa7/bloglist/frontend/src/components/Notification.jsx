import { useContext } from "react";
import NotificationContext from "../context/NotificationContext";

const Notification = () => {
  const { notification } = useContext(NotificationContext)

  if (!notification) {
    return null
  }

  let style = {};

  if (notification.kind === "error") {
    style = {
      color: "red",
      background: "lightgrey",
      fontSize: "1.5em",
      padding: "0.33em",
      border: "2px solid red",
      borderRadius: "0.33em",
      margin: "0.5em 0",
    };
  }

  if (notification.kind === "success") {
    style = {
      color: "green",
      background: "lightgrey",
      fontSize: "1.5em",
      padding: "0.33em",
      border: "2px solid green",
      borderRadius: "0.33em",
      margin: "0.5em 0",
    };
  }

  return <div style={style}>{notification.message}</div>;
};

export default Notification;
