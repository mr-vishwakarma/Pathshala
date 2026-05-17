import { useState } from "react";

import toast from "react-hot-toast";

import { useNavigate, useParams } from "react-router-dom";

import api from "../../../../shared/services/api";

const ResetPasswordPage = () => {
  let { token } = useParams();

  let navigate = useNavigate();

  let [password, setPassword] = useState("");

  let [loading, setLoading] = useState(false);

  let handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let response = await api.post(`/auth/reset-password/${token}`, {
        password,
      });

      toast.success(response.data?.message || "Password reset successful");

      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
      <h1 className="text-3xl font-bold text-center mb-3">Reset Password</h1>

      <p className="text-gray-500 text-center mb-8">
        Enter your new password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
