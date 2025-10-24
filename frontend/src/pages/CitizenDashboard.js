// src/pages/CitizenDashboard.jsx
import React, { useState, useEffect } from "react";
import "./CitizenDashboard.css";

function CitizenDashboard() {
  const username = localStorage.getItem("username");
  const [requests, setRequests] = useState([]);
  const [location, setLocation] = useState("");
  const [wasteType, setWasteType] = useState("");

  useEffect(() => {
    if (!username) return;
    fetch(`http://127.0.0.1:5000/api/requests/${username}`)
      .then((res) => res.json())
      .then((data) => setRequests(data || []))
      .catch((err) => {
        console.error("Failed to fetch requests:", err);
        setRequests([]);
      });
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:5000/api/requests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ citizen_id: username, location, waste_type: wasteType }),
      });
      const data = await res.json();
      if (res.ok) {
        // keep behaviour same: alert + append request to list
        alert("✅ Request submitted!");
        setRequests((prev) => [...prev, data.request]);
        setLocation("");
        setWasteType("");
      } else {
        alert("❌ " + (data.error || "Failed to submit request"));
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("❌ Something went wrong. See console.");
    }
  };

  return (
    <div className="cd-container">
      <div className="cd-header">
        <h1>Citizen Dashboard</h1>
        <div className="cd-sub">Welcome, <strong>{username || "Guest"}</strong></div>
      </div>

      <div className="cd-grid">
        {/* Left: Request form */}
        <div className="cd-card">
          <h3 className="cd-title">Request a Pickup</h3>
          <form className="cd-form" onSubmit={handleSubmit}>
            <label className="cd-label">
              Location
              <input
                className="cd-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Street / Landmark"
                required
              />
            </label>

            <label className="cd-label">
              Waste Type
              <input
                className="cd-input"
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
                placeholder="e.g. general / recyclable / hazardous"
                required
              />
            </label>

            <div className="cd-actions">
              <button className="btn cd-btn" type="submit">Submit Request</button>
            </div>
          </form>
        </div>

        {/* Right: Requests list */}
        <div className="cd-card">
          <h3 className="cd-title">Your Requests</h3>

          {requests.length === 0 ? (
            <div className="cd-empty">You have no requests yet.</div>
          ) : (
            <table className="cd-table">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.request_id || r._id || Math.random()}>
                    <td>{r.waste_type}</td>
                    <td>{r.location}</td>
                    <td>
                      <span className={`badge ${r.status === "pending" ? "pending" : "completed"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="small">{r.created_at ? new Date(r.created_at).toLocaleString() : (r.request_id || "")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default CitizenDashboard;
