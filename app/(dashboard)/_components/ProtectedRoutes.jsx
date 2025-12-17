"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOAuthParamsAndAuth = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const accessToken = searchParams.get("accessToken");

      if (accessToken) {
        console.log("=== ProtectedRoute: Google OAuth params detected ===");
        // Extract user details from URL params
        const firstName = searchParams.get("firstName");
        const lastName = searchParams.get("lastName");
        const email = searchParams.get("email");
        const role = searchParams.get("role");
        const refreshToken = searchParams.get("refreshToken");
        let userId = searchParams.get("id"); // Try to get from URL first

        // If userId is not in URL, decode from accessToken
        if (!userId && accessToken) {
          try {
            const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
            userId = tokenPayload.id;
            console.log("ProtectedRoute: Extracted userId from accessToken payload:", userId);
          } catch (jwtError) {
            console.error("ProtectedRoute: Error decoding accessToken to get userId:", jwtError);
          }
        }

        console.log("ProtectedRoute: User params from URL:", { firstName, lastName, email, role });

        // Store access token
        try {
          localStorage.setItem("login-accessToken", accessToken);
          console.log("ProtectedRoute: ✓ Access token stored in localStorage");
          if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
            console.log("ProtectedRoute: ✓ Refresh token stored in localStorage");
          }

          // Build user object from URL params, ensuring isVerified is true
          const user = {
            _id: userId, // Use the extracted userId
            firstName: firstName || "",
            lastName: lastName || "",
            email: email || "",
            role: role || "",
            isVerified: true, // Google OAuth users are verified
            emailVerified: true, // Also set emailVerified for compatibility
            verified: true, // Also set verified for compatibility
          };

          localStorage.setItem("USER", JSON.stringify(user));
          console.log("ProtectedRoute: ✓ User data stored in localStorage");
          console.log("ProtectedRoute: Access Token:", accessToken);
          console.log("ProtectedRoute: Refresh Token:", refreshToken ? "Present" : "Not present");
          console.log("ProtectedRoute: User Data (from URL params):", user);

          // Clean up URL params and reload to ensure all components pick up new localStorage
          window.history.replaceState({}, "", window.location.pathname); // Clears params
          window.location.reload(); // Reloads the page
          return; // Stop further execution

        } catch (storageError) {
          console.error("ProtectedRoute: Error storing auth data in localStorage:", storageError);
          router.push("/auth/login");
          return;
        }
      }

      // Normal authentication checks if no OAuth params were found or after processing
      const storedUser = localStorage.getItem("USER");

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          if (!allowedRoles.includes(parsedUser.role)) {
            console.log("ProtectedRoute: User role not allowed, redirecting to login");
            router.push("/auth/login");
            return;
          }

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

          if (!isEmailVerified) {
            console.log("ProtectedRoute: Email not verified, redirecting to verify-email");
            router.push("/auth/verify-email");
            return;
          }
        } catch (error) {
          console.error("ProtectedRoute: Failed to parse user from localStorage:", error);
          localStorage.removeItem("USER");
          localStorage.removeItem("login-accessToken");
          localStorage.removeItem("refreshToken");
          router.push("/auth/login");
          return;
        }
      } else {
        console.log("ProtectedRoute: No user data in localStorage, redirecting to login");
        router.push("/auth/login");
        return;
      }

      setLoading(false);
    };

    handleOAuthParamsAndAuth();
  }, [router, allowedRoles]);

  if (loading || !user) return null;

  return children;
};

export default ProtectedRoute;
