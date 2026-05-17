import { createRoot } from "react-dom/client";

import "./index.css";

import AppRoutes from "./app/routes/AppRoutes.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <>
    <AppRoutes />
    <Toaster position="top-right" />
  </>,
);
