import JournalEntryCard from "./JournalEntryCard";

const JournalEntryList = ({ entries, loading, onDelete, onEdit, totalEntries }) => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold">Recent Entries</h2>

        <p className="text-slate-500 dark:text-slate-400">
          {totalEntries} Entries
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-56 animate-pulse rounded-2xl bg-white dark:bg-slate-900"
            />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm dark:bg-slate-900">
          <h3 className="mb-3 text-2xl font-semibold text-slate-700 dark:text-slate-100">
            No Entries Found
          </h3>

          <p className="text-slate-500 dark:text-slate-400">
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
