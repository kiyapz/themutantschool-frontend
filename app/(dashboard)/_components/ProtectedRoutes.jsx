"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("USER");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (!allowedRoles.includes(parsedUser.role)) {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Failed to parse user:", error);
        router.push("/auth/login");
      }
    } else {
      router.push("/auth/login");
    }

    setLoading(false);
  }, []);

  if (loading || !user) return null;

  return children;
};

export default ProtectedRoute;
