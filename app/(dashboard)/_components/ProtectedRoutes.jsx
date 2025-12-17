"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const oauthProcessed = localStorage.getItem("oauthProcessed");

    if (oauthProcessed === "true") {
      // Clear the flag after checking
      localStorage.removeItem("oauthProcessed");
    }

    // Only proceed with auth checks if OAuth has been processed or no OAuth params were present
    if (oauthProcessed === "true" || !window.location.href.includes("accessToken")) {
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
              : false;

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
    } else {
      // If OAuth is still processing, don't set loading to false yet
      // This means the dashboard component is still handling the URL params
      // We will re-evaluate once the oauthProcessed flag is set or the URL changes
    }
  }, [router, allowedRoles]);

  if (loading || !user) return null;

  return children;
};

export default ProtectedRoute;
