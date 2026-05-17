import { useAuth } from "../../../../shared/context/AuthContext";

const DashboardTopbar = () => {
  let { user } = useAuth();

  return (
    <div
      className="card flex items-center justify-between px-6 py-4"
    >
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Welcome back, {user?.fullname || "Student"}!
        </h1>

        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Keep learning and growing every day.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <img
          src={user?.profilePhoto || "https://via.placeholder.com/150"}
          alt="profile"
          className="h-11 w-11 rounded-full object-cover"
          style={{ border: "2px solid var(--purple)" }}
        />

        <div>
          <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            {user?.fullname || "Student"}
          </h3>

          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Student
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardTopbar;
