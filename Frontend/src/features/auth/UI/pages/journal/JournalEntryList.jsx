import JournalEntryCard from "./JournalEntryCard";

const JournalEntryList = ({ entries, loading, onDelete, onEdit, totalEntries }) => {
  return (
    <div>
      <div className="mb-4 md:mb-5 flex items-center justify-between gap-2">
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Recent Entries
        </h2>

        <p className="text-xs md:text-sm" style={{ color: "var(--text-secondary)" }}>
          {totalEntries} Entries
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 md:gap-5 md:grid-cols-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="card h-48 md:h-52 animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="card p-6 md:p-10 text-center">
          <h3 className="mb-2 text-lg md:text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            No Entries Found
          </h3>
          <p className="text-sm md:text-base" style={{ color: "var(--text-secondary)" }}>
            Try changing filters or add entries.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:gap-5 md:grid-cols-2">
          {entries.map((entry) => (
            <JournalEntryCard
              key={entry._id}
              entry={entry}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalEntryList;
