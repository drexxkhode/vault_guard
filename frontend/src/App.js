import Login from "./login";
import Navbar from "./Navbar";
import DataTable from "./DataTable";
import Profile from "./Profile";
import { useEffect, useState } from "react";
import Footer from "./Footer";

const API = process.env.REACT_APP_API_URL;

async function logoutFromBackend() {
  try {
    await fetch(`${API}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    throw new Error("Unable to logout");
  }
}

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({ username: "" });
  const [loading, setIsLoading] = useState(true);

  const resetSession = () => {
    setLoggedIn(false);
    setUser({ username: "" });
  };

  const handleSession = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/session`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.isLoggedIn) {
          setLoggedIn(true);
          setUser(data.user);
        } else {
          resetSession();
        }
      } else {
        resetSession();
      }
    } catch (err) {
      resetSession();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSession();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutFromBackend();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      resetSession();
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={(userData) => {
          setLoggedIn(true);
          setUser(userData); // <- ensure user is set properly on login
          setIsLoading(false);
          handleSession(); // <- fetch session data after login
        }}
      />
    );
  }

  return (
    <div className="app-layout">
      <div className="main-content">
        <Navbar onLogout={handleLogout} />
        <div className="content-area">
          <Profile user={user} />
          <DataTable />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
