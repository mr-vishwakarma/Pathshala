import { createContext, useCallback, useContext, useEffect, useState } from "react";

import api from "../services/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  let [user, setUser] = useState(null);

  let [loading, setLoading] = useState(true);

  let fetchCurrentUser = useCallback(async () => {
    try {
      let response = await api.get("/profile/me");

      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    api
      .get("/profile/me")
      .then((response) => {
        if (isMounted) {
          setUser(response.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
