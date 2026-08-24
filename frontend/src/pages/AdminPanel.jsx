// AdminPanel.jsx
// Lazy-loaded admin page — only loaded when the /admin route is visited.
// React.lazy + Suspense is configured in App.jsx.
// Shows all bookings and allows status updates.

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function AdminPanel() {
  const { token } = useContext(AuthContext);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchAllBookings() {
      try {
        const res = await fetch("http://localhost:5000/api/v1/bookings/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBookings(data);
      } catch {
        setMessage("Could not load bookings.");
      } finally {
        setLoading(false);
      }
    }
    fetchAllBookings();
  }, [token]);

  // Update booking status via PATCH /api/v1/bookings/:id/status
  async function updateStatus(id, newStatus) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Status updated to "${newStatus}"`);
        // Update local state so UI refreshes without full reload
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );
      } else {
        setMessage("Error: " + data.message);
      }
    } catch {
      setMessage("Server error");
    }
  }

  return (
    <div className="page">
      <h1>🛠 Admin Panel</h1>
      <p>Manage all class bookings below.</p>
      {message && <p className="booking-msg">{message}</p>}

      {loading && <p className="loading-msg">⏳ Loading...</p>}

      {!loading && bookings.length === 0 && <p>No bookings found.</p>}

      {!loading && bookings.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Trainer</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.className}</td>
                <td>{b.trainerId?.name || "—"}</td>
                <td>{new Date(b.date).toLocaleDateString()}</td>
                <td>{b.timeSlot}</td>
                <td>{b.status}</td>
                <td>
                  <button onClick={() => updateStatus(b._id, "attended")}>
                    Mark Attended
                  </button>
                  <button onClick={() => updateStatus(b._id, "cancelled")}>
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPanel;
