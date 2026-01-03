import { createContext, useReducer } from "react";

import notificationReducer from "../reducers/notificationReducer";

const NotificationContext = createContext();
let timerId = null;

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  );

  const setNotification = (message, severity, timeInSeconds = 5) => {
    notificationDispatch({ type: "SET", payload: { message, severity } });

    // Clear any existing timer
    if (timerId) {
      clearTimeout(timerId);
    }

    // Clear the notification after the specified time
    timerId = setTimeout(() => {
      notificationDispatch({ type: "RESET" });
    }, timeInSeconds * 1000);
  };

  const setErrorNotification = (message, timeInSeconds = 5) => {
    setNotification(message, "error", timeInSeconds);
  };

  const setSuccessNotification = (message, timeInSeconds = 5) => {
    setNotification(message, "success", timeInSeconds);
  };

  return (
    <NotificationContext.Provider
      value={{ notification, setErrorNotification, setSuccessNotification }}
    >
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
