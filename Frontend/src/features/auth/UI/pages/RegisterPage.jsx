import React, { useState } from "react";

const RegisterPage = () => {


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
  return (
    <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>

      <form className="space-y-4">
        <input
          type="text"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          placeholder="Enter fullname"
          className="w-full border border-gray-300 rounded-lg p-3 outline-none"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          className="w-full border border-gray-300 rounded-lg p-3 outline-none"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          className="w-full border border-gray-300 rounded-lg p-3 outline-none"
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
