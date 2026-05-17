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
    <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
      <h1 className="text-3xl font-bold text-center mb-3">Forgot Password</h1>

      <p className="text-gray-500 text-center mb-8">
        Enter your registered email.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
