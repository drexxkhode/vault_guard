import { useEffect, useState } from "react";
import "./DataTable.css";
const API = process.env.REACT_APP_API_URL;

const DataTable = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ site: "", username: "", password: "", status: "" });
  const [loading, setLoading] = useState(true);
  const [addError, setAddError] = useState("");
  const [editError, setEditError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [idFound, setIdFound] = useState(null);
  const [delModal, setDelModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API}/data`, { credentials: "include" });
      const sites = await response.json();

      if (Array.isArray(sites) && sites.length > 0) {
        setData(sites);
        setError("");
      } else {
        setData([]);
        setError("No data available");
      }
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddData = async (e) => {
    e.preventDefault();
    setAddError("");

    if (!form.site || !form.username || !form.password || !form.status) {
      setAddError("All fields are required");
      return;
    }

    setAdding(true);

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        let errorMsg = "Could not add data";
        try {
          const data = await res.json();
          if (data?.error) errorMsg = data.error;
        } catch {
          errorMsg = res.statusText || errorMsg;
        }
        setAddError(errorMsg);
        return;
      }

      setShowModal(false);
      await fetchData();
      setForm({ site: "", username: "", password: "", status: "" });
    } catch (err) {
      console.error("Add data failed:", err);
      setAddError("Something went wrong. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const fetchEdit = async (id) => {
    try {
      const response = await fetch(`${API}/fetch/${id}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("No site found");
      const res = await response.json();
      const data = res.result[0];
      setIdFound(data.id);
      setForm({
        id: data.id,
        site: data.site,
        username: data.username,
        password: data.password,
        status: data.status,
      });
      setEditModal(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!form.site || !form.username || !form.password || !form.status) {
      setEditError("All fields are required");
      return;
    }

    try {
      const site = await fetch(`${API}/update/${form.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!site.ok) throw new Error("Failed to update site");
      await fetchData();
      setEditModal(false);
      setForm({ site: "", username: "", password: "", status: "" });
      setEditError("");
    } catch (err) {
      setEditError("Error updating site");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Could not delete");
      await fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <div className="datatable-container">Loading...</div>;

  return (
    <div className="datatable-container">
      <h2>Sites</h2>
      <button
        className="add-user-btn"
        onClick={() => {
          setShowModal(true);
          setForm({ site: "", username: "", password: "", status: "" });
        }}
        style={{ marginBottom: 16 }}
      >
        + Add Site
      </button>

      {/* show error (like no data or failed fetch) */}
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

      {data.length > 0 ? (
        <table className="datatable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Site Name</th>
              <th>Username</th>
              <th>Password</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.site}</td>
                <td>{row.username}</td>
                <td>{row.password}</td>
                <td>
                  <span className={`status-badge ${row.status}`}>
                    {row.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => fetchEdit(row.id)} className="edit">
                    edit
                  </button>
                  <button
                    onClick={() => {
                      setIdFound(row.id);
                      setDelModal(true);
                    }}
                    className="del"
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !error && <p>No data available</p>
      )}

      {/* ADD MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Site</h3>
            <form
              onSubmit={handleAddData}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <input
                type="text"
                placeholder="Site Name"
                value={form.site}
                onChange={(e) => setForm({ ...form, site: e.target.value })}
                disabled={adding}
                autoFocus
                className="modal-input"
              />
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                disabled={adding}
                className="modal-input"
              />
              <input
                type="text"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={adding}
                className="modal-input"
              />
              <select
                value={form.status}
                className="modal-input"
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                required
                disabled={adding}
              >
                <option value="">--select status--</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {addError && <div style={{ color: "red", marginBottom: 8 }}>{addError}</div>}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="modal-cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" disabled={adding} className="modal-add-btn">
                  Add site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && idFound && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Site</h3>
            <form
              onSubmit={handleEdit}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <input
                type="text"
                value={form.site}
                onChange={(e) => setForm({ ...form, site: e.target.value })}
                disabled={adding}
                className="modal-input"
              />
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                disabled={adding}
                className="modal-input"
              />
              <input
                type="text"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={adding}
                className="modal-input"
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                disabled={adding}
                className="modal-input"
              >
                <option value="">-- select status --</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {editError && <div style={{ color: "red", marginBottom: 8 }}>{editError}</div>}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => {
                    setEditModal(false);
                    setForm({ site: "", username: "", password: "", status: "" });
                  }}
                  className="modal-cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" disabled={adding} className="modal-add-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {delModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure to delete this site?</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setDelModal(false)}
                className="modal-cancel-btn"
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-add-btn"
                onClick={async () => {
                  await handleDelete(idFound);
                  setDelModal(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
