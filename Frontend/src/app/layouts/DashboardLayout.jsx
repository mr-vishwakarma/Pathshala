import { Outlet, Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../shared/services/api";

const DashboardLayout = () => {
  let navigate = useNavigate();

  let handleLogout = async () => {
    try {
      await api.get("/auth/logout");

      toast.success("Logout successful");

      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">Pathshala</h1>

        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
            Dashboard
          </Link>

          <Link
            to="/dashboard/journal"
            className="text-gray-700 hover:text-blue-600"
          >
            Journal
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
