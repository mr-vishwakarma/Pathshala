import { FaBookOpen, FaClock, FaEdit, FaTrash } from "react-icons/fa";

const difficultyBadge = (level) => {
  if (level === "Easy") return "badge badge-easy";
  if (level === "Medium") return "badge badge-medium";
  return "badge badge-hard";
};

const JournalEntryCard = ({ entry, onDelete, onEdit }) => {
  return (
    <div className="card p-3 md:p-5 transition-shadow duration-200 hover:shadow-md">
      <div className="mb-3 md:mb-4 flex items-start justify-between gap-2">
        <div
          className="flex h-9 md:h-11 w-9 md:w-11 items-center justify-center rounded-lg flex-shrink-0"
          style={{
            background: "rgba(106, 76, 147, 0.15)",
            color: "var(--purple)",
          }}
        >
          <FaBookOpen size={16} />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(entry)}
            className="transition-colors duration-200 p-1.5"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--blue)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-secondary)")
            }
          >
            <FaEdit size={14} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(entry)}
            className="transition-colors duration-200 p-1.5"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--coral)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-secondary)")
            }
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>

      <h3
        className="mb-1.5 text-base md:text-lg font-bold line-clamp-2"
        style={{ color: "var(--text-primary)" }}
      >
        {entry.topicName}
      </h3>

      <p
        className="mb-3 md:mb-4 line-clamp-2 md:line-clamp-3 text-xs md:text-sm leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {entry.description}
      </p>

      <div className="flex items-center justify-between gap-2">
        <div
          className="flex items-center gap-2 text-xs md:text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          <FaClock size={14} />
          <span>{entry.studyDuration}h</span>
        </div>

        <span
          className={`${difficultyBadge(entry.difficultyLevel)} text-xs md:text-sm`}
        >
          {entry.difficultyLevel}
        </span>
      </div>
    </div>
  );
};

export default JournalEntryCard;
