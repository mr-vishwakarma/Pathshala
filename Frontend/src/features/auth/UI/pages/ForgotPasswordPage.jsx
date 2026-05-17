import { useState } from "react";

import toast from "react-hot-toast";

import api from "../../../../shared/services/api";

const ForgotPasswordPage = () => {
  let [email, setEmail] = useState("");

  let [loading, setLoading] = useState(false);

  let handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let response = await api.post("/auth/forgot-password", {
        email,
      });

      toast.success(response.data.message);

      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
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
        Forgot Password
      </h1>

      <p
        className="text-center mb-6 text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        Enter your registered email.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />

        <button type="submit" disabled={loading} className="btn btn-blue w-full py-3">
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
