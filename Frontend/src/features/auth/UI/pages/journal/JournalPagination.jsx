const JournalPagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        disabled={pagination.page === 1}
        onClick={() => onPageChange(pagination.page - 1)}
        className="rounded-xl bg-white px-4 py-2 text-slate-700 shadow-sm disabled:opacity-50 dark:bg-slate-900 dark:text-slate-100"
      >
        Previous
      </button>

      <span className="text-sm text-slate-500 dark:text-slate-400">
        Page {pagination.page} of {pagination.totalPages}
      </span>

      <button
        type="button"
        disabled={pagination.page === pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1)}
        className="rounded-xl bg-white px-4 py-2 text-slate-700 shadow-sm disabled:opacity-50 dark:bg-slate-900 dark:text-slate-100"
      >
        Next
      </button>
    </div>
  );
};

export default JournalPagination;
