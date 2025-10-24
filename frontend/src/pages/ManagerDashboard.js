import React, { useEffect, useState } from "react";
import "./ManagerDashboard.css"; // new CSS file

function ManagerDashboard() {
  const [username, setUsername] = useState("");
  const [tasks, setTasks] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (user) {
      setUsername(user);
      fetch(`http://127.0.0.1:5000/api/dashboard/manager/${user}`)
        .then(res => res.json())
        .then(data => {
          setTasks(data.tasks || []);
          setDrivers(data.drivers || []);
        })
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <div className="manager-dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {username}</h1>
      </header>

      <section className="dashboard-section">
        <h2>All Tasks</h2>
        {tasks.length === 0 ? (
          <p className="empty-message">No tasks available.</p>
        ) : (
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Task ID</th>
                  <th>Driver ID</th>
                  <th>Bin ID</th>
                  <th>Status</th>
                  <th>Route</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task._id}>
                    <td>{task.task_id}</td>
                    <td>{task.driver_id}</td>
                    <td>{task.bin_id}</td>
                    <td>{task.status}</td>
                    
                    <td>{task.route || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Drivers Info</h2>
        {drivers.length === 0 ? (
          <p className="empty-message">No drivers available.</p>
        ) : (
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Truck ID</th>
                  <th>Driver ID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map(driver => (
                  <tr key={driver._id}>
                    <td>{driver.truck_id}</td>
                    <td>{driver.driver_id}</td>
                    <td>{driver.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default ManagerDashboard;
