import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Welcome to Pathshala
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-3">Learning Journal</h2>

          <p className="text-gray-600 mb-4">
            Track your daily learning progress.
          </p>

          <Link
            to="/dashboard/journal"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Open Journal
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-3">Analytics</h2>

          <p className="text-gray-600 mb-4">
            View productivity and study stats.
          </p>

          <button className="bg-green-600 text-white px-5 py-2 rounded-lg">
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
