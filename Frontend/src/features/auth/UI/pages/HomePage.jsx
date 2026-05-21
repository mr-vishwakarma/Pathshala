import { useEffect, useState } from "react";

import { FaLayerGroup, FaClock, FaChartLine, FaListUl } from "react-icons/fa";

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

  let getDifficultyBadge = (level) => {
    if (level === "Easy") return "badge badge-easy";
    if (level === "Medium") return "badge badge-medium";
    return "badge badge-hard";
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card h-32 md:h-36 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            <StatsCard
              title="Total Entries"
              value={dashboardData?.totalEntries}
              subtitle="Learning records"
              icon={FaLayerGroup}
              color="#1982C4"
            />

            <StatsCard
              title="Study Hours"
              value={`${dashboardData?.totalStudyHours}h`}
              subtitle="Total study time"
              icon={FaClock}
              color="#8AC926"
            />

            <StatsCard
              title="Productivity"
              value={dashboardData?.productivityLevel}
              subtitle="Current performance"
              icon={FaChartLine}
              color="#FFCA3A"
            />

            <StatsCard
              title="Recent Entries"
              value={dashboardData?.recentEntries?.length}
              subtitle="Latest activities"
              icon={FaListUl}
              color="#6A4C93"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-5">
            <div className="card p-3 sm:p-5 md:p-6">
              <h2
                className="text-sm sm:text-lg md:text-xl font-bold mb-3 md:mb-5"
                style={{ color: "var(--text-primary)" }}
              >
                Productivity Summary
              </h2>

              <div className="space-y-2.5 md:space-y-4">
                <div className="flex items-center justify-between">
                  <p
                    className="text-xs sm:text-sm md:text-base"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Total Entries
                  </p>
                  <span
                    className="font-semibold text-xs sm:text-sm md:text-base"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {dashboardData?.totalEntries}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p
                    className="text-xs sm:text-sm md:text-base"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Total Hours
                  </p>
                  <span
                    className="font-semibold text-xs sm:text-sm md:text-base"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {dashboardData?.totalStudyHours}h
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p
                    className="text-xs sm:text-sm md:text-base"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Productivity
                  </p>
                  <span
                    className="font-semibold text-xs sm:text-sm md:text-base"
                    style={{ color: "var(--blue)" }}
                  >
                    {dashboardData?.productivityLevel}
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-3 sm:p-5 md:p-6">
              <h2
                className="text-sm sm:text-lg md:text-xl font-bold mb-3 md:mb-5"
                style={{ color: "var(--text-primary)" }}
              >
                Recent Entries
              </h2>

              <div className="space-y-2 md:space-y-3">
                {dashboardData?.recentEntries?.map((entry) => (
                  <div
                    key={entry._id}
                    className="rounded-lg md:rounded-xl p-2 sm:p-3 md:p-4"
                    style={{
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-card-hover)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <h3
                        className="font-semibold text-xs sm:text-sm md:text-base truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {entry.topicName}
                      </h3>

                      <span
                        className={`${getDifficultyBadge(entry.difficultyLevel)} text-[9px] sm:text-xs md:text-sm px-1.5 py-0.5 sm:px-3 sm:py-1`}
                      >
                        {entry.difficultyLevel}
                      </span>
                    </div>

                    <p
                      className="text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
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
