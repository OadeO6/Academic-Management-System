import { useCallback, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(_options?: UseAuthOptions) {
  // Frontend-only temporary auth state

  const demoUser = {
    id: "frontend-demo",
    name: "Frontend User",
    role: "admin",
  };

  const logout = useCallback(async () => {
    console.log("Logout placeholder");
  }, []);

  const state = useMemo(() => {
  return {
    user: {
      id: "demo",
      role: "Lecturer",
      name: "Demo User",
    },
    loading: false,
    error: null,
    isAuthenticated: true,
  };
}, []);

  return {
    ...state,
    refresh: async () => {},
    logout,
  };
}