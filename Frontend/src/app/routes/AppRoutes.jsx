import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";

import DashboardLayout from "../layouts/DashboardLayout";

import LoginPage from "../../features/auth/UI/pages/LoginPage";
import HomePage from "../../features/auth/UI/pages/HomePage";

import JournalPage from "../../features/auth/UI/pages/JournalPage";

import ProtectedRoute from "../../shared/components/ProtectedRoute";

const AppRoutes = () => {
  let router = createBrowserRouter([
    {
      path: "/",

      element: <AuthLayout />,

      children: [
        {
          path: "",

          element: <LoginPage />,
        },
      ],
    },

    {
      path: "/dashboard",

      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),

      children: [
        {
          path: "",

          element: <HomePage />,
        },

        {
          path: "journal",

          element: <JournalPage />,
        },
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
};

export default AppRoutes;
