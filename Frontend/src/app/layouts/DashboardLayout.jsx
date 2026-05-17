import { Outlet } from "react-router-dom";

import DashboardSidebar from "../../features/auth/UI/components/DashboardSidebar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-main)" }}>
      <DashboardSidebar />

      <main className="flex-1 p-6" style={{ color: "var(--text-primary)" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
