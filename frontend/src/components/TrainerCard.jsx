// TrainerCard.jsx
// Reusable component that displays a single trainer's details.
// Props: name (string), specialization (string), available (boolean)

const availabilityMap = {
  true: "Available",
  false: "Fully Booked",
};

function TrainerCard({ name, specialization, available }) {
  // Pick CSS class based on availability
  const statusClass = available ? "status-available" : "status-booked";
  const statusText = availabilityMap[available];

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
