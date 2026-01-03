import { useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
import { useApolloClient } from "@apollo/client/react";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";
import Notify from "./components/Notify";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token")
  );
  const [errorMessage, setErrorMessage] = useState(null);
  const client = useApolloClient();

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  return (
    <div>
      <div>
        <Link to="/authors">
          <button>authors</button>
        </Link>
        <Link to="/books">
          <button>books</button>
        </Link>
        {token && (
          <Link to="/add">
            <button>add book</button>
          </Link>
        )}
        {token && (
          <Link to="/recommendations">
            <button>recommend</button>
          </Link>
        )}
        {!token ? (
          <Link to="/login">
            <button>login</button>
          </Link>
        ) : (
          <button
            onClick={() => {
              setToken(null);
              localStorage.clear();
              client.resetStore();
            }}
          >
            logout
          </button>
        )}
      </div>

      <Notify errorMessage={errorMessage} />

      <Routes>
        <Route path="/authors" element={<Authors setError={notify} />} />
        <Route path="/books" element={<Books />} />
        <Route
          path="/add"
          element={<NewBook show={!!token} setError={notify} />}
        />
        <Route
          path="/recommendations"
          element={<Recommendations show={!!token} />}
        />
        <Route
          path="/login"
          element={<LoginForm setError={notify} setToken={setToken} />}
        />
      </Routes>
    </div>
  );
};

export default App;
