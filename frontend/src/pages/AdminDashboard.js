// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const username = localStorage.getItem("username");
  const [trucks, setTrucks] = useState([]);
  const [bins, setBins] = useState([]);
  const [requests, setRequests] = useState([]);
  const [driverId, setDriverId] = useState("");
  const [binId, setBinId] = useState("");
  const [route, setRoute] = useState("");
  const [updatingDrivers, setUpdatingDrivers] = useState([]); // track which drivers are updating
  const API = "http://127.0.0.1:5000/api/facility";

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch(`${API}/`);
      const data = await res.json();
      setTrucks(data.trucks || []);
      setBins(data.bins || []);
      setRequests(data.requests || []);
    } catch (err) {
      console.error("Failed to load facility data:", err);
      alert("Failed to load facility data. See console for details.");
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!driverId || !binId) {
      alert("Please select driver and bin.");
      return;
    }
    try {
      const res = await fetch(`${API}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driver_id: driverId, bin_id: binId, route }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Task assigned successfully!");
        setDriverId("");
        setBinId("");
        setRoute("");
        loadData();
      } else {
        alert("❌ " + (data.error || "Failed to assign task"));
      }
    } catch (err) {
      console.error("Assign error:", err);
      alert("❌ Error assigning task (check console).");
    }
  };

  // ----------------------------
  // Individual driver toggle with button disable
  // ----------------------------
  const toggleDriverStatus = async (driver) => {
    if (updatingDrivers.includes(driver._id)) return; // already updating, ignore click

    const newStatus = driver.status === "available" ? "busy" : "available";

    // optimistically update UI
    setTrucks(prevTrucks =>
      prevTrucks.map(t =>
        t._id === driver._id ? { ...t, status: newStatus } : t
      )
    );

    // mark driver as updating
    setUpdatingDrivers(prev => [...prev, driver._id]);

    try {
      const res = await fetch(`${API}/driver_status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driver_id: driver.driver_id, status: newStatus }),
      });

      if (!res.ok) {
        console.warn("Driver status update failed. Reloading data...");
        loadData(); // revert if backend fails
      }
    } catch (err) {
      console.warn("Driver status update request failed:", err);
      loadData(); // revert if fetch fails
    } finally {
      // remove driver from updating list
      setUpdatingDrivers(prev => prev.filter(id => id !== driver._id));
    }
  };

  return (
    <div className="adm-root">
      <header className="adm-header">
        <div>
          <h2 className="adm-title">Admin Dashboard</h2>
          <div className="adm-sub">Welcome, <strong>{username || "Admin"}</strong></div>
        </div>
        <div className="adm-actions">
          <button className="btn secondary" onClick={loadData}>Refresh</button>
        </div>
      </header>

      <main className="adm-grid">
        {/* Left column: Assign + Requests */}
        <section className="adm-left">
          <div className="adm-card">
            <h3 className="card-heading">Assign Task</h3>
            <form className="assign-form" onSubmit={handleAssign}>
              <label className="form-row">
                <span>Driver</span>
                <select value={driverId} onChange={(e) => setDriverId(e.target.value)} required>
                  <option value="">Select Driver</option>
                  {trucks.map(t => (
                    <option key={t._id} value={t.driver_id}>
                      {t.driver_username || t.driver_id} — Truck {t.truck_id} ({t.status})
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-row">
                <span>Bin</span>
                <select value={binId} onChange={(e) => setBinId(e.target.value)} required>
                  <option value="">Select Bin</option>
                  {bins.map(b => (
                    <option key={b._id} value={b.bin_id}>
                      {b.bin_id} — {b.location} ({b.status})
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-row">
                <span>Route (optional)</span>
                <input type="text" placeholder="e.g. Zone A → Yard 1" value={route} onChange={e => setRoute(e.target.value)} />
              </label>

              <div className="form-row form-actions">
                <button className="btn primary" type="submit">Assign</button>
                <button className="btn ghost" type="button" onClick={() => { setDriverId(""); setBinId(""); setRoute(""); }}>Clear</button>
              </div>
            </form>
          </div>

          <div className="adm-card" style={{ marginTop: 16 }}>
            <h3 className="card-heading">Pending Citizen Requests</h3>
            {requests.length === 0 ? (
              <div className="empty">No pending requests.</div>
            ) : (
              <ul className="requests-list">
                {requests.map(r => (
                  <li key={r._id} className="request-row">
                    <div><strong>{r.waste_type}</strong> — {r.location}</div>
                    <div className="small">by {r.citizen_id} • <span className={`badge ${r.status}`}>{r.status}</span></div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Right column: Drivers table */}
        <aside className="adm-right">
          <div className="adm-card">
            <h3 className="card-heading">Drivers & Trucks</h3>
            {trucks.length === 0 ? (
              <div className="empty">No drivers/trucks found.</div>
            ) : (
              <div className="table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Driver</th>
                      <th>Truck</th>
                      <th>Status</th>
                      <th style={{ textAlign: "center" }}>Toggle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trucks.map(d => (
                      <tr key={d._id}>
                        <td>{d.driver_username || d.driver_id}</td>
                        <td>{d.truck_id}</td>
                        <td><span className={`status-badge ${d.status === "available" ? "available" : "busy"}`}>{d.status}</span></td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="btn small"
                            onClick={() => toggleDriverStatus(d)}
                            disabled={updatingDrivers.includes(d._id)}
                          >
                            {updatingDrivers.includes(d._id)
                              ? "Updating..."
                              : d.status === "available"
                                ? "Set Busy"
                                : "Set Available"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

export default AdminDashboard;
