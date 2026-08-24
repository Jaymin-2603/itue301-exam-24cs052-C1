// ClassesPage.jsx
// Protected page — shows trainers from API and a booking form.
// Task 1: Renders TrainerCard components
// Task 2: Booking form with useState
// Task 4: Fetches trainers from GET /api/v1/trainers, search filter

import { useState, useEffect, useContext } from "react";
import TrainerCard from "../components/TrainerCard";
import { AuthContext } from "../context/AuthContext";

function ClassesPage() {
  const { token, member } = useContext(AuthContext);

  // ─── Trainer fetch states (Task 4) ───────────────────────────────
  const [trainers, setTrainers] = useState([]);   // all trainers from API
  const [loading, setLoading] = useState(true);   // loading indicator
  const [error, setError] = useState("");          // error message

  // ─── Search filter (Task 4) ──────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");

  // ─── Booking form states (Task 2) ────────────────────────────────
  const [selectedTrainer, setSelectedTrainer] = useState("");  // state 1
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(""); // state 2
  const [className, setClassName] = useState("");
  const [date, setDate] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");

  // Fetch trainers when the component first mounts (Task 4)
  useEffect(() => {
    async function fetchTrainers() {
      try {
        const res = await fetch("http://localhost:5000/api/v1/trainers");
        if (!res.ok) throw new Error("Failed to fetch trainers");
        const data = await res.json();
        setTrainers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTrainers();
  }, []); // empty array = runs once on mount

  // Client-side filter — no new API call, just .filter() on existing array
  const filteredTrainers = trainers.filter((t) =>
    t.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle booking form submission
  async function handleBooking(e) {
    e.preventDefault();
    setBookingMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/v1/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          trainerId: selectedTrainer,
          className,
          date,
          timeSlot: selectedTimeSlot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setBookingMsg("Error: " + (data.message || "Booking failed"));
      } else {
        setBookingMsg("✅ Booking confirmed!");
        // Reset form
        setSelectedTrainer("");
        setSelectedTimeSlot("");
        setClassName("");
        setDate("");
      }
    } catch {
      setBookingMsg("Cannot connect to server.");
    }
  }

  return (
    <div className="page">
      <h1>🏃 Classes</h1>

      {/* ── Booking Form (Task 2) ── */}
      <section className="section">
        <h2>Book a Class</h2>
        {/* Live display of selected state values (Task 2 requirement) */}
        {selectedTrainer && (
          <p className="state-display">
            Selected Trainer ID: <strong>{selectedTrainer}</strong>
          </p>
        )}
        {selectedTimeSlot && (
          <p className="state-display">
            Selected Time Slot: <strong>{selectedTimeSlot}</strong>
          </p>
        )}

        <form onSubmit={handleBooking} className="booking-form">
          <div className="form-group">
            <label>Trainer</label>
            <select
              value={selectedTrainer}
              onChange={(e) => setSelectedTrainer(e.target.value)}
              required
            >
              <option value="">-- Select Trainer --</option>
              {trainers.map((t) => (
                <option key={t._id} value={t._id} disabled={!t.available}>
                  {t.name} {!t.available ? "(Busy for next 3 days)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Class Name</label>
            <input
              type="text"
              placeholder="e.g., Yoga, Zumba, CrossFit"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Time Slot</label>
            <select
              value={selectedTimeSlot}
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              required
            >
              <option value="">-- Select Time --</option>
              <option value="06:00 AM">06:00 AM</option>
              <option value="08:00 AM">08:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
              <option value="06:00 PM">06:00 PM</option>
            </select>
          </div>

          <button type="submit">Book Class</button>
        </form>

        {bookingMsg && <p className="booking-msg">{bookingMsg}</p>}
      </section>

      {/* ── Trainer List with Search (Task 4) ── */}
      <section className="section">
        <h2>Our Trainers</h2>

        <input
          type="text"
          placeholder="Search by specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        {/* Loading / Error / Data states (Task 4) */}
        {loading && <p className="loading-msg">⏳ Loading trainers...</p>}
        {error && <p className="error-msg">❌ {error}</p>}

        {!loading && !error && (
          <div className="trainer-grid">
            {filteredTrainers.length > 0 ? (
              filteredTrainers.map((trainer) => (
                // Pass data from API response to TrainerCard via props (Task 1 & 4)
                <TrainerCard
                  key={trainer._id}
                  name={trainer.name}
                  specialization={trainer.specialization}
                  available={trainer.available}
                />
              ))
            ) : (
              <p>No trainers found for "{searchTerm}"</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default ClassesPage;
