import { createRoot } from "react-dom/client";

import "./index.css";

import AppRoutes from "./app/routes/AppRoutes.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  
  <Toaster position="top-right" />,
  <AppRoutes />,
);
