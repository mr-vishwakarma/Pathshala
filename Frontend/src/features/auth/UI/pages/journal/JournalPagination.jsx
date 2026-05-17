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
        className="btn card px-4 py-2 text-sm disabled:opacity-40"
        style={{ color: "var(--text-primary)" }}
      >
        Previous
      </button>

      <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
        Page {pagination.page} of {pagination.totalPages}
      </span>

      <button
        type="button"
        disabled={pagination.page === pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1)}
        className="btn card px-4 py-2 text-sm disabled:opacity-40"
        style={{ color: "var(--text-primary)" }}
      >
        Next
      </button>
    </div>
  );
};

export default JournalPagination;
