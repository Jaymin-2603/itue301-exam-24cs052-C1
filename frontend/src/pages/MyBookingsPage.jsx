// MyBookingsPage.jsx
// Protected page — shows the logged-in member's class bookings.
// Fetches GET /api/v1/bookings/my using the auth token.

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function MyBookingsPage() {
  const { token, member } = useContext(AuthContext);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMyBookings() {
      try {
        const res = await fetch("http://localhost:5000/api/v1/bookings/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load bookings");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMyBookings();
  }, [token]);

  // Map status to a CSS class for colour coding
  const statusClass = {
    booked: "status-booked-tag",
    attended: "status-attended-tag",
    cancelled: "status-cancelled-tag",
  };

  return (
    <div className="page">
      <h1>📋 My Bookings</h1>
      {member && <p>Showing bookings for: <strong>{member.name}</strong></p>}

      {loading && <p className="loading-msg">⏳ Loading your bookings...</p>}
      {error && <p className="error-msg">❌ {error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <p>No bookings yet. Go to Classes to book one!</p>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="bookings-list">
          {bookings.map((b) => (
            <div key={b._id} className="booking-card">
              <h3>{b.className}</h3>
              <p>
                <strong>Trainer:</strong>{" "}
                {b.trainerId?.name || "Unknown"}
              </p>
              <p>
                <strong>Specialization:</strong>{" "}
                {b.trainerId?.specialization || "—"}
              </p>
              <p>
                <strong>Date:</strong> {new Date(b.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time Slot:</strong> {b.timeSlot}
              </p>
              <span className={statusClass[b.status] || "status-booked-tag"}>
                {b.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookingsPage;
