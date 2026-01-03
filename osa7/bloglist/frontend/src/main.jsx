import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import { NotificationContextProvider } from "./context/NotificationContext";
import { UserContextProvider } from "./context/UserContext";

import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <NotificationContextProvider>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <Router>
          <App />
        </Router>
      </UserContextProvider>
    </QueryClientProvider>
  </NotificationContextProvider>
);
