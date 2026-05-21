import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

import DashboardSidebar from "../../features/auth/UI/components/DashboardSidebar";
import { useAuth } from "../../shared/context/AuthContext";

const DashboardLayout = () => {
  let [sidebarOpen, setSidebarOpen] = useState(false);
  let location = useLocation();
  let navigate = useNavigate();
  let { user } = useAuth();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-main)" }}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile, visible on md+ */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar - Slide from left */}
      <div
        className="fixed left-0 top-0 h-screen z-40 md:hidden transition-transform duration-300"
        style={{
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <DashboardSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Universal Sticky Header */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 py-3.5 border-b backdrop-blur-md bg-white/80 dark:bg-[#1a1a1a]/80 transition-colors"
          style={{
            borderColor: "var(--border-color)",
          }}
        >
          {/* Left Side: Mobile Menu Button & App Logo / User Greeting */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg transition-colors cursor-pointer"
              style={{ background: "var(--coral)", color: "white" }}
            >
              {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
            
            <h2 className="font-bold text-base md:text-lg flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <span className="md:hidden font-extrabold tracking-tight" style={{ color: "var(--coral)" }}>Pathshala</span>
              <span className="hidden md:inline font-semibold">
                Welcome back, <span style={{ color: "var(--purple)" }} className="font-bold">{user?.fullname || "Learner"}</span>! 👋
              </span>
            </h2>
          </div>

          {/* Right Side: Profile Icon */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/profile")}
              className="hover:opacity-80 transition-all duration-200 rounded-full cursor-pointer flex items-center"
              title="View Profile"
            >
              <img
                src={user?.profilePhoto || "https://via.placeholder.com/150"}
                alt="profile"
                className="h-9 w-9 md:h-10 md:w-10 rounded-full object-cover shadow-sm hover:scale-105 transition-transform duration-200"
                style={{ border: "2.5px solid var(--purple)" }}
              />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div
          className="flex-1 overflow-auto p-4 md:p-6"
          style={{ color: "var(--text-primary)" }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
