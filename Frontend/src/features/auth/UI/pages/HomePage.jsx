import { useEffect, useState } from "react";

import DashboardTopbar from "../components/DashboardTopbar";

import StatsCard from "../components/StatsCard";

import api from "../../../../shared/services/api";

const HomePage = () => {
  let [dashboardData, setDashboardData] = useState(null);

  let [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    api
      .get("/dashboard/stats")
      .then((response) => {
        if (isMounted) {
          setDashboardData(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <DashboardTopbar />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white h-36 rounded-2xl animate-pulse dark:bg-slate-900"></div>

          <div className="bg-white h-36 rounded-2xl animate-pulse dark:bg-slate-900"></div>

          <div className="bg-white h-36 rounded-2xl animate-pulse dark:bg-slate-900"></div>

          <div className="bg-white h-36 rounded-2xl animate-pulse dark:bg-slate-900"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatsCard
              title="Total Entries"
              value={dashboardData?.totalEntries}
              subtitle="Learning records"
            />

            <StatsCard
              title="Study Hours"
              value={`${dashboardData?.totalStudyHours}h`}
              subtitle="Total study time"
            />

            <StatsCard
              title="Productivity"
              value={dashboardData?.productivityLevel}
              subtitle="Current performance"
            />

            <StatsCard
              title="Recent Entries"
              value={dashboardData?.recentEntries?.length}
              subtitle="Latest activities"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm dark:bg-slate-900">
              <h2 className="text-2xl font-bold mb-6">Productivity Summary</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 dark:text-slate-400">Total Entries</p>

                  <span className="font-semibold">
                    {dashboardData?.totalEntries}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-600 dark:text-slate-400">Total Hours</p>

                  <span className="font-semibold">
                    {dashboardData?.totalStudyHours}h
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-600 dark:text-slate-400">Productivity</p>

                  <span className="font-semibold text-blue-600">
                    {dashboardData?.productivityLevel}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm dark:bg-slate-900">
              <h2 className="text-2xl font-bold mb-6">Recent Entries</h2>

              <div className="space-y-4">
                {dashboardData?.recentEntries?.map((entry) => (
                  <div
                    key={entry._id}
                    className="border border-gray-100 rounded-xl p-4 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">
                        {entry.topicName}
                      </h3>

                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
                        {entry.difficultyLevel}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm mt-2">
                      {entry.studyDuration}h studied
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
