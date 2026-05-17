import { useState } from "react";

import { Link, Navigate, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../../../shared/services/api";

import { useAuth } from "../../../../shared/context/AuthContext";

const LoginPage = () => {
  let navigate = useNavigate();

  let { user, fetchCurrentUser } = useAuth();

  let [isLogin, setIsLogin] = useState(true);

  let [loading, setLoading] = useState(false);

  let [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  let handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let endpoint = isLogin ? "/auth/login" : "/auth/register";

      let response = await api.post(endpoint, formData);

      toast.success(response.data.message);

      if (isLogin) {
        await fetchCurrentUser();

        navigate("/dashboard", { replace: true });
      }

      setFormData({
        fullname: "",
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="card w-full max-w-md p-8">
      <h1
        className="text-3xl font-extrabold text-center mb-1"
        style={{ color: "var(--purple)" }}
      >
        Pathshala
      </h1>

      <p
        className="text-center text-sm mb-6"
        style={{ color: "var(--text-secondary)" }}
      >
        Your learning journal
      </p>

      <div
        className="grid grid-cols-2 rounded-lg p-1 mb-6"
        style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-color)" }}
      >
        <button
          onClick={() => setIsLogin(true)}
          className="py-2 rounded-md font-semibold text-sm transition-all duration-200"
          style={{
            background: isLogin ? "var(--bg-card)" : "transparent",
            color: isLogin ? "var(--blue)" : "var(--text-secondary)",
            boxShadow: isLogin ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
          }}
        >
          Login
        </button>

        <button
          onClick={() => setIsLogin(false)}
          className="py-2 rounded-md font-semibold text-sm transition-all duration-200"
          style={{
            background: !isLogin ? "var(--bg-card)" : "transparent",
            color: !isLogin ? "var(--blue)" : "var(--text-secondary)",
            boxShadow: !isLogin ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
          }}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              Full Name
            </label>

            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter full name"
              className="input-field"
            />
          </div>
        )}

        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--text-secondary)" }}
          >
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="input-field"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              className="block text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Password
            </label>

            {isLogin && (
              <Link
                to="/forgot-password"
                className="text-sm font-medium"
                style={{ color: "var(--blue)" }}
              >
                Forgot Password?
              </Link>
            )}
          </div>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            className="input-field"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-blue w-full py-3">
          {loading
            ? "Please wait..."
            : isLogin
              ? "Sign In to Journal"
              : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
