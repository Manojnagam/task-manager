import { useState } from "react";
import AuthPage from "./AuthPage";
import TasksPage from "./TasksPage";
import { isLoggedIn, logout } from "./api";
import "./App.css";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  function handleLogout() {
    logout();
    setLoggedIn(false);
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>
      {loggedIn ? (
        <TasksPage onLogout={handleLogout} />
      ) : (
        <AuthPage onLoggedIn={() => setLoggedIn(true)} />
      )}
    </div>
  );
}