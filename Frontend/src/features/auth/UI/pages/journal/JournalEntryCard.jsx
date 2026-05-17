import { FaBookOpen, FaClock, FaEdit, FaTrash } from "react-icons/fa";

const difficultyBadge = (level) => {
  if (level === "Easy") return "badge badge-easy";
  if (level === "Medium") return "badge badge-medium";
  return "badge badge-hard";
};

const JournalEntryCard = ({ entry, onDelete, onEdit }) => {
  return (
    <div className="card p-5 transition-shadow duration-200 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-lg"
          style={{ background: "rgba(106, 76, 147, 0.15)", color: "var(--purple)" }}
        >
          <FaBookOpen />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onEdit(entry)}
            className="transition-colors duration-200"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--blue)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            <FaEdit />
          </button>

          <button
            type="button"
            onClick={() => onDelete(entry)}
            className="transition-colors duration-200"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--coral)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <h3 className="mb-1.5 text-lg font-bold" style={{ color: "var(--text-primary)" }}>
        {entry.topicName}
      </h3>

      <p
        className="mb-4 line-clamp-3 text-sm leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {entry.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          <FaClock />
          <span>{entry.studyDuration}h</span>
        </div>

        <span className={difficultyBadge(entry.difficultyLevel)}>
          {entry.difficultyLevel}
        </span>
      </div>
    </div>
  );
};

export default JournalEntryCard;
