import { Outlet } from "react-router-dom";

import DashboardSidebar from "../../features/auth/UI/components/DashboardSidebar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f5f7fb] dark:bg-slate-950">
      <DashboardSidebar />

      <main className="flex-1 p-6 text-slate-900 dark:text-slate-100">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
