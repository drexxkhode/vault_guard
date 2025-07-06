import React, { useEffect, useState } from 'react';
import './DataTable.css';
const API = process.env.REACT_APP_API_URL; // Fallback for local development
const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', auth: '', password: '', status: '' });
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API}/data`, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch data');
      const users = await response.json();
      
      if (Array.isArray(users)) {
        setData(users);
      } else {
        setError('Unexpected response format.');
      }
    } catch (err) {
      setError('Could not load user data.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddData = async (e) => {
    e.preventDefault();
    setAddError('');
    if (!form.name.trim() || !form.auth.trim() || !form.password.trim() || !form.status.trim()) {
      setAddError('All fields are required.');
      return;
    }
    setAdding(true);
    try {
      const response = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Failed to add data');
      // Refresh data after successful add
      await fetchData();
      setForm({ name: '', auth: '', password: '', status: '' });
      setShowModal(false);
    } catch (err) {
      setAddError('Could not add data.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="datatable-container">Loading...</div>;
  if (error) return <div className="datatable-container">{error}</div>;

  return (
    <div className="datatable-container">
      <h2>User Data</h2>
      <button
        className="add-user-btn"
        onClick={() => setShowModal(true)}
        style={{ marginBottom: 16 }}
      >
        + Add User
      </button>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Site</h3>
            <form onSubmit={handleAddData} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="text"
                placeholder="Site Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                disabled={adding}
                autoFocus
                className="modal-input"
              />
              <input
                type="text"
                placeholder="Username"
                value={form.auth}
                onChange={e => setForm({ ...form, auth: e.target.value })}
                disabled={adding}
                className="modal-input"
              />
              <input
                type="text"
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                disabled={adding}
                className="modal-input"
              />
              <input
                type="text"
                placeholder="Status"
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                disabled={adding}
                className="modal-input"
              />
              {addError && <div style={{ color: 'red', marginBottom: 8 }}>{addError}</div>}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="modal-cancel-btn">Cancel</button>
                <button type="submit" disabled={adding} className="modal-add-btn">Add site</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <table className="datatable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Site Name</th>
            <th>Username</th>
            <th>Password</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.auth}</td>
              <td>{row.password}</td>
              <td>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
