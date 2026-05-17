import { createRoot } from "react-dom/client";

import "./index.css";

import AppRoutes from "./app/routes/AppRoutes.jsx";

import { Toaster } from "react-hot-toast";

import AuthProvider from "./shared/context/AuthContext.jsx";
import ThemeProvider from "./shared/context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AuthProvider>
      <Toaster position="top-right" />

      <AppRoutes />
    </AuthProvider>
  </ThemeProvider>,
);
