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
    <div className="card w-full max-w-md p-8">
      <h1
        className="text-3xl font-bold text-center mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        Reset Password
      </h1>

      <p
        className="text-center mb-6 text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        Enter your new password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />

        <button type="submit" disabled={loading} className="btn btn-blue w-full py-3">
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
