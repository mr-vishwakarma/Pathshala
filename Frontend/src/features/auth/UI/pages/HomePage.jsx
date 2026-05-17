import DashboardTopbar from "../components/DashboardTopbar";

import StatsCard from "../components/StatsCard";

const HomePage = () => {
  return (
    <div className="space-y-6">
      <DashboardTopbar />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard title="Total Entries" value="24" subtitle="+5 this week" />

        <StatsCard
          title="Total Hours"
          value="48h 30m"
          subtitle="+6h this week"
        />

        <StatsCard
          title="Current Streak"
          value="7 days"
          subtitle="Keep it up"
        />

        <StatsCard title="Monthly Goal" value="75%" subtitle="18 of 24 days" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Continue Your Journey</h2>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Write Journal Entry</h3>

                <p className="text-gray-500">Record what you learned today</p>
              </div>

              <button className="text-blue-600">→</button>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">View Analytics</h3>

                <p className="text-gray-500">See your learning progress</p>
              </div>

              <button className="text-blue-600">→</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Recent Entries</h2>

          <div className="space-y-4">
            <div className="border border-gray-100 rounded-lg p-4">
              <h3 className="font-semibold">React Data Fetching</h3>

              <p className="text-sm text-gray-500 mt-1">2.5 hours studied</p>
            </div>

            <div className="border border-gray-100 rounded-lg p-4">
              <h3 className="font-semibold">JWT Authentication</h3>

              <p className="text-sm text-gray-500 mt-1">3 hours studied</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
