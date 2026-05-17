import { useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../../../shared/services/api";

const LoginPage = () => {
  let navigate = useNavigate();

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

  return (
    <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Welcome back
      </h1>

      <div className="grid grid-cols-2 bg-gray-100 rounded-md p-1 mb-6">
        <button
          onClick={() => setIsLogin(true)}
          className={`py-2 rounded-md font-medium transition-all duration-200 ${
            isLogin ? "bg-white shadow-sm" : "text-gray-500"
          }`}
        >
          Login
        </button>

        <button
          onClick={() => setIsLogin(false)}
          className={`py-2 rounded-md font-medium transition-all duration-200 ${
            !isLogin ? "bg-white shadow-sm" : "text-gray-500"
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Fullname
            </label>

            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter fullname"
              className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            University Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="enter your email"
            className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>
          </div>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-md font-semibold transition-all duration-200"
        >
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
