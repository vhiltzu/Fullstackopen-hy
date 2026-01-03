import { Link } from "react-router-dom";
import { useContext } from "react";

import UserContext from "../context/UserContext";
import NotificationContext from "../context/NotificationContext";

const Navigation = () => {
  const { setSuccessNotification } = useContext(NotificationContext);
  const { userSession, clearUserSession } = useContext(UserContext);

  const padding = {
    padding: 8,
  };

  const handleLogout = () => {
    clearUserSession();
    setSuccessNotification("Logged out successfully");
  };

  return (
    <nav>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      <div style={{ ...padding, display: "inline-block" }}>
        {userSession ? (
          <>
            <span>{userSession.name} logged in </span>
            <button type="button" onClick={handleLogout}>
              logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button type="button">login</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
