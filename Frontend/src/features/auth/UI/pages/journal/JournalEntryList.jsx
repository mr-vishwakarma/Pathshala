import JournalEntryCard from "./JournalEntryCard";

const JournalEntryList = ({ entries, loading, onDelete, onEdit, totalEntries }) => {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Recent Entries
        </h2>

        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {totalEntries} Entries
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="card h-52 animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="card p-10 text-center">
          <h3 className="mb-2 text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            No Entries Found
          </h3>
          <p style={{ color: "var(--text-secondary)" }}>
            Try changing filters or add entries.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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
