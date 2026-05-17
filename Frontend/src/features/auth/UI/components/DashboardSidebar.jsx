import { Link, useLocation, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { FaHome, FaBook, FaUser, FaSun, FaMoon, FaSignOutAlt } from "react-icons/fa";

import api from "../../../../shared/services/api";

import { useAuth } from "../../../../shared/context/AuthContext";
import { useTheme } from "../../../../shared/context/ThemeContext";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: FaHome },
  { name: "Journal", path: "/dashboard/journal", icon: FaBook },
  { name: "Profile", path: "/dashboard/profile", icon: FaUser },
];

const DashboardSidebar = () => {
  let location = useLocation();

  let navigate = useNavigate();

  let { setUser } = useAuth();

  let { theme, toggleTheme } = useTheme();

  let handleLogout = async () => {
    try {
      await api.get("/auth/logout");

      setUser(null);

      toast.success("Logout successful");

      navigate("/", { replace: true });
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div
      className="w-[260px] min-h-screen flex flex-col justify-between"
      style={{ background: "var(--coral)" }}
    >
      <div>
        <div className="px-6 py-8 border-b border-white/20">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Pathshala
          </h1>
        </div>

        <div className="p-4 space-y-1">
          {menuItems.map((item) => {
            let isActive = location.pathname === item.path;
            let Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200"
                style={{
                  background: isActive ? "#fff" : "transparent",
                  color: isActive ? "var(--coral)" : "#fff",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-white/20 space-y-1">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 hover:bg-white/15"
        >
          {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 hover:bg-red-700"
        >
          <FaSignOutAlt size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
