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

        // Check if user role is allowed
        if (!allowedRoles.includes(parsedUser.role)) {
          router.push("/auth/login");
          return;
        }

        // Check email verification status
        // Support multiple possible field names for email verification
        const isEmailVerified =
          parsedUser.emailVerified !== undefined
            ? parsedUser.emailVerified
            : parsedUser.isEmailVerified !== undefined
            ? parsedUser.isEmailVerified
            : parsedUser.verified !== undefined
            ? parsedUser.verified
            : parsedUser.isVerified !== undefined
            ? parsedUser.isVerified
            : parsedUser.email_verified !== undefined
            ? parsedUser.email_verified
            : false; // Default to false if field doesn't exist - require verification

        // If email is not verified, redirect to verification page
        if (!isEmailVerified) {
          router.push("/auth/verify-email");
          return;
        }
      } catch (error) {
        console.error("Failed to parse user:", error);
        router.push("/auth/login");
      }
    } else {
      router.push("/auth/login");
    }

    setLoading(false);
  }, [router, allowedRoles]);

  if (loading || !user) return null;

  return children;
};

export default ProtectedRoute;
