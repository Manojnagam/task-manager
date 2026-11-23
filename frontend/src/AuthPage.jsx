import { useState } from "react";
import { login, register } from "./api";

export default function AuthPage({ onLoggedIn }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        await register(email, password);
      }
      await login(email, password);
      onLoggedIn();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{mode === "login" ? "Log in" : "Create account"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password (at least 8 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={8}
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Please wait..." : mode === "login" ? "Log in" : "Register"}
      </button>
      <p className="switch">
        {mode === "login" ? "No account?" : "Already registered?"}{" "}
        <button type="button" className="link" onClick={switchMode}>
          {mode === "login" ? "Register" : "Log in"}
        </button>
      </p>
    </form>
  );
}