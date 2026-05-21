const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 md:px-4 py-4 md:py-6">
      <div className="card w-full max-w-2xl p-4 md:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="mb-4 md:mb-5 flex items-center justify-between gap-3">
          <h2
            className="text-lg md:text-xl font-bold truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 md:px-3 py-1 text-xs md:text-sm font-medium transition-colors duration-200 flex-shrink-0"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--border-color)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Close
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;
