const DashboardTopbar = () => {
  return (
    <div className="bg-white rounded-xl px-6 py-4 shadow-sm flex items-center justify-between">

      <div>

        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, Devendra! 👋
        </h1>

        <p className="text-gray-500 mt-1">
          Keep learning and growing every day.
        </p>

      </div>

      <div className="flex items-center gap-4">

        <div className="w-10 h-10 rounded-full bg-gray-200"></div>

        <div>

          <h3 className="font-semibold text-gray-700">
            Devendra Dhote
          </h3>

          <p className="text-sm text-gray-500">
            Student
          </p>

        </div>

      </div>

    </div>
  );
};

export default DashboardTopbar;
