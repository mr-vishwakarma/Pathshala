import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import HomePage from "../../features/auth/UI/pages/HomePage";
import LoginPage from "../../features/auth/UI/pages/LoginPage";
import RegisterPage from "../../features/auth/UI/pages/RegisterPage";
import DashboardLayout from "../layouts/DashboardLayout";


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
          path: "/register",
          element: <RegisterPage />,
        },
      ],
    },

    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        {
          path: "",
          element: <HomePage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
