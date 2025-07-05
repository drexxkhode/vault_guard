import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import DataTable from './DataTable';
import UserProfile from './UserProfile';
import Footer from './Footer';
import Login from './Login';
import './App.css';
const API=process.env.REACT_APP_API_URL;
async function logoutFromBackend() {
  try {
    await fetch(`${API}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    // Optionally handle error
  }
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({ username: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`${API}/session`, {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          if (data.loggedIn) {
            setUser(data.user);
            setLoggedIn(true);
          } else {
            setLoggedIn(false);
            setUser({ username: '' });
          }
        } else {
          setLoggedIn(false);
          setUser({ username: '' });
        }
      } catch (err) {
        setLoggedIn(false);
        setUser({ username: '' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await logoutFromBackend();
    setLoggedIn(false);
    setUser({ username: '' });
  };

  if (loading) return <div>Loading...</div>;
  if (!loggedIn) {
    return <Login onLogin={() => {
      setLoggedIn(true);
      // Optionally re-fetch user info here
    }} />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar onLogout={handleLogout} />
        <div className="content-area">
          <UserProfile username={user.username || ''} />
          <DataTable />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
