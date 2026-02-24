import { useEffect, useState } from "react";
import API from "../services/api";
import "./AdminDashboard.css";
import "./AdminUsers.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  // ===== FETCH STATS =====
  const fetchStats = async () => {
    try {
      const { data } = await API.get("/admin/stats");
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  // ===== FETCH USERS =====
  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/admin/users");
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  // ===== APPROVE FEES =====
  const handleApproveFees = async (userId) => {
    try {
      await API.put(`/admin/approve-fees/${userId}`);
      alert("Fees approved");

      fetchUsers();
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  if (!stats) {
    return <div className="admin-container">Loading admin data...</div>;
  }

  return (
  <div className="admin-container">
    {/* HEADER */}
    <div className="admin-header">
      <h2 className="admin-title">Admin Dashboard 👑</h2>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>

    {/* ===== STATS GRID ===== */}
    <div className="stats-grid">
      <StatCard label="Total Users" value={stats.totalUsers} />
      <StatCard label="Total Students" value={stats.totalStudents} />
      <StatCard label="Total Admins" value={stats.totalAdmins} />
      <StatCard label="Total Seats" value={stats.totalSeats} />
      <StatCard label="Occupied Seats" value={stats.occupiedSeats} />
      <StatCard label="Available Seats" value={stats.availableSeats} />
      <StatCard label="Students Present" value={stats.studentsPresent} />
    </div>

    {/* ===== USERS TABLE ===== */}
    <div className="users-container">
      <h3 className="users-title">Manage Users</h3>

      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Fees Paid</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={
                      user.role === "admin"
                        ? "role-admin"
                        : "role-student"
                    }
                  >
                    {user.role}
                  </span>
                </td>

                <td>
                  {user.feesPaid ? (
                    <span className="paid">✅ Paid</span>
                  ) : (
                    <span className="pending">❌ Pending</span>
                  )}
                </td>

                <td>
                  {user.role === "student" && (
                    <button
                      className="approve-btn"
                      disabled={user.feesPaid}
                      onClick={() => handleApproveFees(user._id)}
                    >
                      Approve Fees
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}

// ===== SMALL REUSABLE CARD =====
function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-number">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default AdminDashboard;
