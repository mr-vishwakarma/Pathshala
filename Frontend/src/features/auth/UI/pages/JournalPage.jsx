import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import api from "../../../../shared/services/api";

const JournalPage = () => {
  let [formData, setFormData] = useState({
    topicName: "",
    description: "",
    studyDuration: "",
    difficultyLevel: "Easy",
  });

  let [entries, setEntries] = useState([]);

  let [loading, setLoading] = useState(false);

  let fetchEntries = async () => {
    let response = await api.get("/journal/all");

    return response.data;
  };

  let handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let response = await api.post("/journal/add", formData);

      toast.success(response.data.message);

      setFormData({
        topicName: "",
        description: "",
        studyDuration: "",
        difficultyLevel: "Easy",
      });

      let updatedEntries = await fetchEntries();

      setEntries(updatedEntries);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetchEntries()
      .then((data) => {
        if (isMounted) {
          setEntries(data);
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to load entries");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-blue-600">Learning Journal</h1>

        <p className="text-gray-500 mt-2">Track your learning journey.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Add Journal Entry</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            name="topicName"
            value={formData.topicName}
            onChange={handleChange}
            placeholder="Enter topic name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What did you learn?"
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none"
          />

          <input
            type="number"
            name="studyDuration"
            value={formData.studyDuration}
            onChange={handleChange}
            placeholder="Study duration in hours"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
          />

          <select
            name="difficultyLevel"
            value={formData.difficultyLevel}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
          >
            <option value="Easy">Easy</option>

            <option value="Medium">Medium</option>

            <option value="Hard">Hard</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Adding..." : "Add Entry"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recent Entries</h2>

        {entries.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500">No journal entries yet.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry._id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-2xl font-semibold">{entry.topicName}</h3>

                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                  {entry.difficultyLevel}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{entry.description}</p>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {entry.studyDuration} hours
                </p>

                <p className="text-sm text-gray-400">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalPage;
