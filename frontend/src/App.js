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

 // App.jsx
useEffect(() => {
  // always run once on mount
  (async () => {
    try {
      const res = await fetch(`${API}/session`, {
        credentials: 'include'
      });
      if (res.ok) {
        const { user } = await res.json();
        setUser(user);
        setLoggedIn(true);          // <- only set true when session confirmed
      } else {
        setLoggedIn(false);
      }
    } catch (err) {
      console.error(err);
      setLoggedIn(false);
    }
  })();
}, []);


  const handleLogout = async () => {
    await logoutFromBackend();
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar onLogout={handleLogout} />
        <div className="content-area">
          <UserProfile  />
          <DataTable />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
