import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            type="email"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            type="password"
            placeholder="Enter your password"
          />
        </div>

        <button
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          type="submit"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        New here?{" "}
        <Link className="font-medium text-blue-600" to="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
