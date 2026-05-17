import { FaSearch } from "react-icons/fa";

const JournalFilters = ({
  searchText,
  selectedDifficulty,
  onDifficultyChange,
  onSearchChange,
}) => {
  return (
    <div className="card p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <FaSearch
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-secondary)" }}
          />

          <input
            type="text"
            placeholder="Search topic..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field pl-11"
          />
        </div>

        <select
          value={selectedDifficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          className="input-field w-auto min-w-[160px]"
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
    </div>
  );
};

export default JournalFilters;
