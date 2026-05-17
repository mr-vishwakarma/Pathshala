const JournalForm = ({
  formData,
  loading,
  onCancel,
  onChange,
  onSubmit,
  submitLabel,
}) => {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <input
        type="text"
        name="topicName"
        value={formData.topicName}
        onChange={onChange}
        placeholder="Enter topic name"
        className="input-field"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={onChange}
        placeholder="What did you learn?"
        rows="4"
        className="input-field resize-none"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          type="number"
          name="studyDuration"
          value={formData.studyDuration}
          onChange={onChange}
          placeholder="Study duration (hours)"
          className="input-field"
        />

        <select
          name="difficultyLevel"
          value={formData.difficultyLevel}
          onChange={onChange}
          className="input-field"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="btn btn-blue">
          {loading ? "Saving..." : submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn"
            style={{ color: "var(--text-secondary)" }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default JournalForm;
