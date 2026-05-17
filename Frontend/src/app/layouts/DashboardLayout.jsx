import { Outlet } from "react-router-dom";

import DashboardSidebar from "../../features/auth/UI/components/DashboardSidebar";

const DashboardLayout = () => {
  return (
    <div className="flex bg-[#f5f7fb]">
      <DashboardSidebar />

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
