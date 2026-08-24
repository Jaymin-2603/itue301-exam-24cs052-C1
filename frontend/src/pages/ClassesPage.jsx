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
  const [selectedType, setSelectedType] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(""); // state 2
  const [className, setClassName] = useState("");
  const [date, setDate] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");
  const [showPopup, setShowPopup] = useState(null); // Stores the popup message

  // Extract unique specializations for the "Trainer Type Needed" dropdown
  const uniqueTypes = [...new Set(trainers.map(t => t.specialization))];
  
  // Filter trainers for the dropdown based on selected type
  const availableTrainersForType = selectedType 
    ? trainers.filter(t => t.specialization === selectedType)
    : trainers;

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
        setSelectedType("");
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
      <section className="section glass-panel">
        <h2>Book a Class</h2>

        <form onSubmit={handleBooking} className="booking-form">
          
          <div className="form-group">
            <label>Trainer Type Needed</label>
            <select
              value={selectedType}
              onChange={(e) => {
                const type = e.target.value;
                setSelectedType(type);
                setClassName(type); // Auto-fill class name
                setSelectedTrainer(""); // reset trainer when type changes
              }}
              required
            >
              <option value="">-- Select Type --</option>
              {uniqueTypes.map((type, idx) => (
                <option key={idx} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Trainer</label>
            <select
              value={selectedTrainer}
              onChange={(e) => {
                const trainerId = e.target.value;
                setSelectedTrainer(trainerId);
                
                if (trainerId) {
                  const t = trainers.find(tr => tr._id === trainerId);
                  if (t && !t.available) {
                    setShowPopup(`${t.name} is currently busy for the next 3 days. You may book a class with them for a date after that.`);
                  }
                }
              }}
              required
              disabled={!selectedType} // force user to pick a type first
            >
              <option value="">{selectedType ? "-- Select Trainer --" : "-- Select Type First --"}</option>
              {availableTrainersForType.map((t) => (
                <option key={t._id} value={t._id}>
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
              onChange={(e) => {
                const val = e.target.value;
                setClassName(val);
                
                // Auto-select Trainer Type if the typed class name CONTAINS a known type keyword
                const matchedType = uniqueTypes.find(
                  (t) => val.toLowerCase().includes(t.toLowerCase())
                );
                
                if (matchedType) {
                  setSelectedType(matchedType);
                } else {
                  // If they completely remove the keyword, clear the selected type and trainer
                  setSelectedType("");
                  setSelectedTrainer("");
                }
              }}
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

      {/* ── Popup Modal ── */}
      {showPopup && (
        <div className="modal-overlay" onClick={() => setShowPopup(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Trainer Unavailable</h3>
            <p>{showPopup}</p>
            <button onClick={() => setShowPopup(null)}>Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassesPage;
