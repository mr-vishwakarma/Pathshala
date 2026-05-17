import { FaBookOpen, FaClock, FaEdit, FaTrash } from "react-icons/fa";

const JournalEntryCard = ({ entry, onDelete, onEdit }) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          <FaBookOpen />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onEdit(entry)}
            className="text-slate-500 hover:text-blue-600 dark:text-slate-400"
          >
            <FaEdit />
          </button>

          <button
            type="button"
            onClick={() => onDelete(entry)}
            className="text-slate-500 hover:text-red-500 dark:text-slate-400"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">
        {entry.topicName}
      </h3>

      <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {entry.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <FaClock />

          <span>{entry.studyDuration}h</span>
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          {entry.difficultyLevel}
        </span>
      </div>
    </div>
  );
};

export default JournalEntryCard;
