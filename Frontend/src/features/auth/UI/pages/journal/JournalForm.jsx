const JournalForm = ({
  formData,
  loading,
  onCancel,
  onChange,
  onSubmit,
  submitLabel,
}) => {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <input
        type="text"
        name="topicName"
        value={formData.topicName}
        onChange={onChange}
        placeholder="Enter topic name"
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={onChange}
        placeholder="What did you learn?"
        rows="4"
        className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          type="number"
          name="studyDuration"
          value={formData.studyDuration}
          onChange={onChange}
          placeholder="Study duration"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />

        <select
          name="difficultyLevel"
          value={formData.difficultyLevel}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-6 py-3 text-white transition-all duration-200 hover:bg-blue-700 disabled:opacity-70"
        >
          {loading ? "Saving..." : submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-6 py-3 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default JournalForm;
