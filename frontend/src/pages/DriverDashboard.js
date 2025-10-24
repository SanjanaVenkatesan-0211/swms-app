// src/pages/DriverDashboard.jsx
import React, { useEffect, useState } from "react";
import "./DriverDashboard.css";

function DriverDashboard() {
  const username = localStorage.getItem("username");
  const [tasks, setTasks] = useState([]);

  // Fetch tasks assigned to driver
  useEffect(() => {
    if (!username) return;
    fetch(`http://127.0.0.1:5000/api/driver/${username}`)
      .then((res) => res.json())
      .then((data) => setTasks(data || []))
      .catch((err) => console.error("Failed to load tasks:", err));
  }, [username]);

  const handleComplete = async (taskId) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/driver/complete/${taskId}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Task marked as completed!");
        setTasks((prev) => prev.map(t => t._id === taskId ? { ...t, status: "Completed" } : t));
      } else {
        alert("❌ " + (data.error || "Failed to update task"));
      }
    } catch (err) {
      console.error("Complete error:", err);
      alert("❌ Something went wrong. See console.");
    }
  };

  return (
    <div className="driver-root">
      <div className="driver-header">
        <div>
          <h2>Welcome, <span className="driver-name">{username || "Driver"}</span></h2>
          <div className="driver-sub">Assigned collection tasks</div>
        </div>
      </div>

      <div className="driver-content">
        <div className="driver-card">
          <h3 className="card-title">Your Tasks</h3>

          {tasks.length === 0 ? (
            <div className="empty">No tasks assigned.</div>
          ) : (
            <div className="table-wrap">
              <table className="driver-table">
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Bin</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id}>
                      <td className="mono">{task.task_id}</td>
                      <td>{task.bin_id}</td>
                      <td>{task.route || "—"}</td>
                      <td>
                        <span className={`status-badge ${(task.status || "").toLowerCase() === "completed" ? "completed" : "pending"}`}>
                          {task.status || "pending"}
                        </span>
                      </td>
                      <td>
                        { (task.status || "").toLowerCase() !== "completed" ? (
                          <button className="btn btn-complete" onClick={() => handleComplete(task._id)}>Complete</button>
                        ) : (
                          <button className="btn btn-disabled" disabled>Completed</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;
