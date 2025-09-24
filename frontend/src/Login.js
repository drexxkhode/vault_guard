import './login.css';
import React, { useEffect, useState } from 'react';
const API= process.env.REACT_APP_API_URL ;
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [retryAfter, setRetryAfter] = useState(0);
  const [csrfToken, setCsrfToken] = useState('');

  
const fetchCsrfToken = async () => {
    try {
      const res = await fetch(`${API}/csrf-token`, { credentials: "include" });
      const data = await res.json();
      setCsrfToken(data.csrfToken);
    } catch (err) {
      console.error("Failed to fetch CSRF token", err);
    }
  };

  //  Fetch CSRF token on mount
  useEffect(() => {
    fetchCsrfToken();
  }, []);

  // ⏳ Restore lockout on mount
  useEffect(() => {
    const lockoutEnd = localStorage.getItem("lockoutEnd");
    if (lockoutEnd) {
      const remaining = Math.floor((new Date(lockoutEnd) - new Date()) / 1000);
      if (remaining > 0) {
        setRetryAfter(remaining);
      } else {
        localStorage.removeItem("lockoutEnd");
      }
    }
  }, []);

  // ⏲️ Countdown effect
  useEffect(() => {
    let timer;
    if (retryAfter > 0) {
      timer = setInterval(() => {
        setRetryAfter((prev) => {
          if (prev <= 1) {
            localStorage.removeItem("lockoutEnd");
            fetchCsrfToken(); // Refresh CSRF token after lockout
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [retryAfter]);
  
  // 🚀 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        credentials: "include", // 👈 include session cookie
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken, // 👈 send token in header
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setError('');
        onLogin(data.user);
      } else if (res.status === 429) {
        const retry = data.retryAfter || 60;
        const lockoutEnd = new Date(Date.now() + retry * 1000);
        localStorage.setItem("lockoutEnd", lockoutEnd.toISOString());
        setRetryAfter(retry);
        setError('');
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>LOGIN</h1>

        <input
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={retryAfter > 0}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={retryAfter > 0}
        />

        {error && <div className="login-error">{error}</div>}
        {retryAfter > 0 && (
          <p style={{ color: 'black', fontWeight: 'bold' }}>
            Please try again after {formatTime(retryAfter)} minutes.
          </p>
        )}

        <button type="submit" disabled={retryAfter > 0 || !csrfToken}>
          {csrfToken ? "Login" : "Loading..."}
        </button>
      </form>
    </div>
  );
}

export default Login;
