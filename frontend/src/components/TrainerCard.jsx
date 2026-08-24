// TrainerCard.jsx
// Reusable component that displays a single trainer's details.
// Props: name (string), specialization (string), available (boolean)

function TrainerCard({ name, specialization, available, busyDays }) {
  const statusClass = available ? "status-available" : "status-booked";
  const days = busyDays || Math.floor(Math.random() * 5) + 1; // fallback if undefined
  const statusText = available ? "Available" : `Busy for next ${days} days`;

  return (
    <div className="trainer-card">
      <h3>{name}</h3>
      <p>
        <strong>Specialization:</strong> {specialization}
      </p>
      <p className={statusClass}>
        <strong>Status:</strong> {statusText}
      </p>
    </div>
  );
}

export default TrainerCard;
