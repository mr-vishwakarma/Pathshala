import { useEffect, useState } from "react";

import api from "../../../../shared/services/api";

const DashboardTopbar = () => {
  let [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    api
      .get("/profile/me")
      .then((response) => {
        if (isMounted) {
          setUser(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow-sm dark:bg-slate-900">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Welcome back, {user?.fullname || "Student"}!
        </h1>

        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Keep learning and growing every day.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <img
          src={user?.profilePhoto || "https://via.placeholder.com/150"}
          alt="profile"
          className="h-12 w-12 rounded-full border object-cover"
        />

        <div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-100">
            {user?.fullname || "Student"}
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">Student</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardTopbar;
