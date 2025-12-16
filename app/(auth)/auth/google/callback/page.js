"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for error from OAuth provider
        const errorParam = searchParams.get("error");
        if (errorParam) {
          setError("Google authentication failed. Please try again.");
          setLoading(false);
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
          return;
        }

        // Get the code from URL params (OAuth authorization code)
        const code = searchParams.get("code");
        
        if (!code) {
          // If backend redirects with token directly in URL params
          const accessToken = searchParams.get("accessToken");
          const token = searchParams.get("token");
          
          if (accessToken || token) {
            const tokenToStore = accessToken || token;
            const userParam = searchParams.get("user");
            
            // Store token
            localStorage.setItem("login-accessToken", tokenToStore);
            
            // Parse and store user if provided
            if (userParam) {
              try {
                const user = JSON.parse(decodeURIComponent(userParam));
                localStorage.setItem("USER", JSON.stringify(user));
                
                // Redirect based on user role
                if (user.role === "instructor") {
                  router.push("/instructor");
                } else if (user.role === "student") {
                  router.push("/student/dashboard");
                } else if (user.role === "affiliate") {
                  router.push("/affiliate");
                } else {
                  router.push("/");
                }
                return;
              } catch (e) {
                console.error("Error parsing user data:", e);
              }
            }
            
            // If no user data, just redirect to home
            router.push("/");
            return;
          }
          
          setError("No authentication code received.");
          setLoading(false);
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
          return;
        }

        // Call backend callback endpoint to exchange code for token
        const response = await fetch(
          `https://themutantschool-backend.onrender.com/api/auth/google/callback?code=${code}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Google OAuth callback response:", data);

        if (data.success && data.accessToken) {
          // Store tokens and user data
          localStorage.setItem("login-accessToken", data.accessToken);
          if (data.refreshToken) {
            localStorage.setItem("refreshToken", data.refreshToken);
          }
          if (data.user) {
            localStorage.setItem("USER", JSON.stringify(data.user));
            console.log("User data stored:", data.user);
          }

          // Redirect based on user role
          const user = data.user;
          if (user && user.role) {
            if (user.role === "instructor") {
              router.push("/instructor");
            } else if (user.role === "student") {
              router.push("/student/dashboard");
            } else if (user.role === "affiliate") {
              router.push("/affiliate");
            } else {
              router.push("/");
            }
          } else {
            router.push("/");
          }
          setLoading(false);
        } else {
          setError(data.message || "Authentication failed. Please try again.");
          setLoading(false);
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
        }
      } catch (err) {
        console.error("Google OAuth callback error:", err);
        setError("An error occurred during authentication. Please try again.");
        setLoading(false);
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="w-12 h-12 border-4 border-t-[var(--secondary)] border-gray-700 rounded-full animate-spin mb-4"></div>
        <p className="text-lg">Completing Google authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
        <div className="text-center max-w-md">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <p className="text-gray-400">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return null;
}

