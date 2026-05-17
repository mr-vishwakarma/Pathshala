import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";

import DashboardLayout from "../layouts/DashboardLayout";

import LoginPage from "../../features/auth/UI/pages/LoginPage";

import ForgotPasswordPage from "../../features/auth/UI/pages/ForgotPasswordPage";

import ResetPasswordPage from "../../features/auth/UI/pages/ResetPasswordPage";

import HomePage from "../../features/auth/UI/pages/HomePage";

import JournalPage from "../../features/auth/UI/pages/JournalPage";

import ProfilePage from "../../features/auth/UI/pages/ProfilePage";

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

        {
          path: "/forgot-password",

          element: <ForgotPasswordPage />,
        },

        {
          path: "/reset-password/:token",

          element: <ResetPasswordPage />,
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

        {
          path: "profile",

          element: <ProfilePage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
