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
        className="input-field text-sm md:text-base"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={onChange}
        placeholder="What did you learn?"
        rows="4"
        className="input-field resize-none text-sm md:text-base"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <input
          type="number"
          name="studyDuration"
          value={formData.studyDuration}
          onChange={onChange}
          placeholder="Study duration (hours)"
          className="input-field text-sm md:text-base"
        />

        <select
          name="difficultyLevel"
          value={formData.difficultyLevel}
          onChange={onChange}
          className="input-field text-sm md:text-base"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div className="flex items-center gap-2 md:gap-3 flex-wrap">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-blue text-sm md:text-base"
        >
          {loading ? "Saving..." : submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn text-sm md:text-base"
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
