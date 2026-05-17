import { Link, useLocation, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../../../shared/services/api";

import { useAuth } from "../../../../shared/context/AuthContext";
import { useTheme } from "../../../../shared/context/ThemeContext";

const DashboardSidebar = () => {
  let location = useLocation();

  let navigate = useNavigate();

  let { setUser } = useAuth();

  let { theme, toggleTheme } = useTheme();

  let menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },

    {
      name: "Journal",
      path: "/dashboard/journal",
    },

    {
      name: "Profile",
      path: "/dashboard/profile",
    },
  ];

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
    <div className="w-[260px] min-h-screen bg-[#071028] text-white flex flex-col justify-between">
      <div>
        <div className="px-6 py-8 border-b border-white/10">
          <h1 className="text-2xl font-bold">Pathshala</h1>
        </div>

        <div className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-blue-600"
                  : "hover:bg-white/10"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <button
          type="button"
          onClick={toggleTheme}
          className="mb-2 w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200"
        >
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-500 transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
