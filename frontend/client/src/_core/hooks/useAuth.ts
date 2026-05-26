import { useCallback, useMemo, useState, useEffect } from "react";

type UserRole = "student" | "lecturer" | "hod" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(_options?: UseAuthOptions) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // Normalize role to lowercase
        if (parsed.role) {
          parsed.role = parsed.role.toLowerCase();
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // Clear storage
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_token");
      setUser(null);
      // Redirect to home
      window.location.href = "/";
    } catch (err) {
      setError("Logout failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    // Placeholder for refreshing session from API
    console.log("Refreshing session...");
  }, []);

  const state = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated,
  }), [user, loading, error, isAuthenticated]);

  return {
    ...state,
    setUser: (user: User | null) => {
      if (user) {
        user.role = user.role.toLowerCase() as UserRole;
        localStorage.setItem("auth_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("auth_user");
      }
      setUser(user);
    },
    refresh,
    logout,
  };
}
