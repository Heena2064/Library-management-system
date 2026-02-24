import { useEffect, useState } from "react";
import API from "../services/api";
import "./StudentDashboard.css";

function StudentDashboard() {
  const [seats, setSeats] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  // ================= FETCH SEATS =================
  const fetchSeats = async () => {
    try {
      const { data } = await API.get("/seats");
      setSeats(data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= FETCH USER =================
  const fetchUser = async () => {
    try {
      const { data } = await API.get("/auth/me");
      setUserInfo(data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= BOOK SEAT =================
  const handleBookSeat = async (seatNumber) => {
    try {
      await API.post("/seats/book", { seatNumber });
      alert("Seat booked successfully");
      fetchSeats();
      fetchUser();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  // ================= CHECK IN =================
  const handleCheckIn = async () => {
    try {
      await API.post("/attendance/checkin");
      alert("Checked in successfully");
      fetchUser();
      fetchSeats();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  // ================= CHECK OUT =================
  const handleCheckOut = async () => {
    try {
      await API.post("/attendance/checkout");
      alert("Checked out successfully");
      fetchUser();
      fetchSeats();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchSeats();
    fetchUser();
  }, []);

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login";
};


  return (
    <div className="dashboard-container">
      <h2>Student Dashboard</h2>

      {userInfo && (
        <h3 className="welcome-text">
          Welcome, {userInfo.name} 👋
        </h3>
      )}


      <button
  onClick={handleLogout}
  style={{
    marginBottom: "15px",
    padding: "6px 12px",
    cursor: "pointer",
  }}
>
  Logout
</button>




      {/* ===== INFO CARD ===== */}
      {userInfo && (
        <div className="info-card">
          <p>
            <b>Your Seat:</b> {userInfo.seatNumber || "Not booked"}
          </p>

          <p>
            <b>Present Status:</b>{" "}
            {userInfo.isPresent ? "Present 🟢" : "Absent 🔴"}
          </p>

          <button
            className="action-btn checkin-btn"
            onClick={handleCheckIn}
            disabled={!userInfo.seatNumber || userInfo.isPresent}
          >
            Check In
          </button>

          <button
            className="action-btn checkout-btn"
            onClick={handleCheckOut}
            disabled={!userInfo.isPresent}
          >
            Check Out
          </button>
        </div>
      )}

      {/* ===== SEAT LEGEND ===== */}
<div style={{ marginBottom: "15px" }}>
  <span style={{ marginRight: "15px" }}>🟢 Free</span>
  <span style={{ marginRight: "15px" }}>🔴 Occupied</span>
  <span>🔵 Your Seat</span>
</div>


      {/* ===== SEAT GRID ===== */}
      <div className="seat-grid">
        {seats.map((seat) => (
          <div
            key={seat._id}
            className={`seat-box ${
              userInfo?.seatNumber === seat.seatNumber
                ? "seat-mine"
                : seat.isOccupied
                ? "seat-occupied"
                : "seat-free"
            }`}
            onClick={() =>
              !seat.isOccupied &&
              !userInfo?.seatNumber &&
              handleBookSeat(seat.seatNumber)
            }
          >
            {seat.seatNumber}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentDashboard;
