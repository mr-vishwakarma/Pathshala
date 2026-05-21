import { Link, useLocation, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {
  FaHome,
  FaBook,
  FaUser,
  FaSun,
  FaMoon,
  FaSignOutAlt,
} from "react-icons/fa";

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
      className="w-64 md:w-65 min-h-screen flex flex-col justify-between"
      style={{ background: "var(--coral)" }}
    >
      <div>
        <div className="px-4 md:px-6 py-6 md:py-8 border-b border-white/20">
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
            Pathshala
          </h1>
        </div>

        <div className="p-3 md:p-4 space-y-1">
          {menuItems.map((item) => {
            let isActive = location.pathname === item.path;
            let Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 md:px-4 py-3 rounded-lg font-medium text-sm md:text-base transition-all duration-300 relative group"
                style={{
                  background: isActive ? "#fff" : "transparent",
                  color: isActive ? "var(--coral)" : "#fff",
                  boxShadow: isActive ? "0 10px 20px -5px rgba(0, 0, 0, 0.12)" : "none",
                  transform: isActive ? "translateY(-1px) scale(1.02)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.transform = "translateX(3px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.transform = "none";
                  }
                }}
              >
                <Icon size={18} className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-105"}`} />
                <span className="truncate">{item.name}</span>
                {isActive && (
                  <span 
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" 
                    style={{ background: "var(--coral)" }} 
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-3 md:p-4 border-t border-white/20 space-y-1">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full text-left px-3 md:px-4 py-3 rounded-lg text-white text-sm md:text-base font-medium transition-all duration-200 hover:bg-white/15"
        >
          {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
          <span className="truncate">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left px-3 md:px-4 py-3 rounded-lg text-white text-sm md:text-base font-medium transition-all duration-200 hover:bg-red-700"
        >
          <FaSignOutAlt size={18} />
          <span className="truncate">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
