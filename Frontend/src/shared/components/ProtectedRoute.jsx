import { useEffect, useState } from "react";

import { Navigate } from "react-router-dom";
import api from "../services/api";

const ProtectedRoute = ({
  children,
}) => {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let isMounted = true;

    api
      .get("/auth/profile")
      .then(() => {
        if (isMounted) {
          setStatus("authenticated");
        }
      })
      .catch(() => {
        if (isMounted) {
          setStatus("unauthenticated");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Loading...
      </div>
    );
  }

  return status === "authenticated" ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
