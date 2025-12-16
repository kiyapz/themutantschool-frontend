"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if localStorage is available
        if (typeof window === "undefined" || !window.localStorage) {
          console.error("❌ localStorage is not available");
          setError(
            "Local storage is not available. Please enable cookies/local storage."
          );
          setLoading(false);
          return;
        }

        // Log all URL params for debugging
        console.log("=== Google Auth Callback Hit ===");
        console.log("Full URL:", window.location.href);
        console.log(
          "All URL params:",
          Object.fromEntries(searchParams.entries())
        );
        console.log(
          "localStorage available:",
          typeof window.localStorage !== "undefined"
        );

        // Check for error from OAuth provider
        const errorParam = searchParams.get("error");
        if (errorParam) {
          console.error("OAuth error param:", errorParam);
          setError("Google authentication failed. Please try again.");
          setLoading(false);
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
          return;
        }

        // Check if backend redirected with accessToken in URL params (backend redirects with params)
        const accessToken = searchParams.get("accessToken");
        console.log(
          "AccessToken from URL:",
          accessToken ? "Found" : "Not found"
        );

        if (accessToken) {
          // Backend redirected with token and user details in URL params
          console.log("=== Backend redirected with accessToken in URL ===");
          console.log("AccessToken:", accessToken);

          // Extract user details from URL params
          const firstName = searchParams.get("firstName");
          const lastName = searchParams.get("lastName");
          const email = searchParams.get("email");
          const role = searchParams.get("role");
          const refreshToken = searchParams.get("refreshToken");

          console.log("User role:", role);
          console.log("User params:", {
            firstName,
            lastName,
            email,
            role,
            refreshToken: refreshToken ? "Found" : "Not found",
          });

          // Store access token first
          try {
            localStorage.setItem("login-accessToken", accessToken);
            console.log("✓ Access token stored in localStorage");

            if (refreshToken) {
              localStorage.setItem("refreshToken", refreshToken);
              console.log("✓ Refresh token stored in localStorage");
            }
          } catch (storageError) {
            console.error(
              "Error storing tokens in localStorage:",
              storageError
            );
          }

          // Try to fetch full user profile from backend using the token
          try {
            // Decode token to get user ID
            const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
            const userId = tokenPayload.id;

            console.log("Fetching full user profile for ID:", userId);

            // Fetch full user profile
            const profileResponse = await fetch(
              `https://themutantschool-backend.onrender.com/api/user-profile/${userId}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              const fullUser = profileData.data || profileData;

              console.log("Full user profile fetched:", fullUser);
              console.log("User data:", JSON.stringify(fullUser, null, 2));

              // Store complete user object (same as normal login)
              try {
                localStorage.setItem("USER", JSON.stringify(fullUser));
                console.log(
                  "✓ Full user data stored in localStorage with key 'USER'"
                );
                console.log("Stored user role:", fullUser.role);
              } catch (storageError) {
                console.error(
                  "Error storing user in localStorage:",
                  storageError
                );
              }

              // Redirect based on user role (same logic as normal login)
              const redirectPath =
                fullUser.role === "instructor"
                  ? "/instructor"
                  : fullUser.role === "student"
                  ? "/student/dashboard"
                  : fullUser.role === "affiliate"
                  ? "/affiliate"
                  : "/";

              console.log("Redirecting to:", redirectPath);
              setLoading(false);

              // Use window.location to ensure localStorage is written before navigation
              setTimeout(() => {
                window.location.href = redirectPath;
              }, 100);
              return;
            } else {
              const errorText = await profileResponse.text();
              console.warn(
                "Failed to fetch user profile, status:",
                profileResponse.status
              );
              console.warn("Error response:", errorText);
              console.warn("Falling back to URL params");
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            console.error("Error details:", error.message);
          }

          // Fallback: Build minimal user object from URL params if profile fetch fails
          // This should have at least _id from the token payload
          console.log("Building user object from URL params and token...");
          const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
          console.log("Token payload:", tokenPayload);

          const user = {
            _id: tokenPayload.id,
            firstName: firstName || "",
            lastName: lastName || "",
            email: email || tokenPayload.email || "",
            role: role || tokenPayload.role || "",
          };

          console.log("User object created:", user);
          console.log("User data:", JSON.stringify(user, null, 2));

          try {
            localStorage.setItem("USER", JSON.stringify(user));
            console.log(
              "✓ Minimal user data stored in localStorage with key 'USER'"
            );
            console.log("Stored user role:", user.role);

            // Verify it was stored
            const storedUser = localStorage.getItem("USER");
            console.log(
              "Verification - User in localStorage:",
              storedUser ? "Found" : "NOT FOUND"
            );
          } catch (storageError) {
            console.error("Error storing user in localStorage:", storageError);
          }

          // Redirect based on user role (same logic as normal login)
          const userRole = role || tokenPayload.role || "";
          const redirectPath =
            userRole === "instructor"
              ? "/instructor"
              : userRole === "student"
              ? "/student/dashboard"
              : userRole === "affiliate"
              ? "/affiliate"
              : "/";

          console.log(
            "Redirecting to:",
            redirectPath,
            "based on role:",
            userRole
          );
          setLoading(false);

          // Use window.location to ensure localStorage is written before navigation
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 100);
          return;
        }

        // Get the code from URL params (OAuth authorization code)
        console.log("No accessToken found, checking for OAuth code...");
        const code = searchParams.get("code");
        const scope = searchParams.get("scope");
        const authuser = searchParams.get("authuser");
        const prompt = searchParams.get("prompt");

        console.log("OAuth params:", {
          code: code ? "Found" : "Not found",
          scope,
          authuser,
          prompt,
        });

        // Build the full query string for the backend callback
        const queryParams = new URLSearchParams();
        if (code) queryParams.append("code", code);
        if (scope) queryParams.append("scope", scope);
        if (authuser) queryParams.append("authuser", authuser);
        if (prompt) queryParams.append("prompt", prompt);

        if (!code) {
          console.error(
            "❌ No authentication code or token received in URL params"
          );
          console.error(
            "Available params:",
            Object.fromEntries(searchParams.entries())
          );
          setError("No authentication code or token received.");
          setLoading(false);
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
          return;
        }

        // Call backend callback endpoint to exchange code for token
        // Include all query parameters that Google might have passed
        const frontendCallbackUrl = `${window.location.origin}/auth/google/callback`;
        queryParams.append("redirect_uri", frontendCallbackUrl);

        const backendCallbackUrl = `https://themutantschool-backend.onrender.com/api/auth/google/callback?${queryParams.toString()}`;
        console.log("Calling backend callback:", backendCallbackUrl);

        const response = await fetch(backendCallbackUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          redirect: "follow", // Follow redirects automatically
        });

        // Log full response details
        console.log("=== Backend Response Details ===");
        console.log("Status:", response.status);
        console.log("Status Text:", response.statusText);
        console.log("URL:", response.url);
        console.log("Redirected:", response.redirected);
        console.log("OK:", response.ok);
        console.log("Headers:", Object.fromEntries(response.headers.entries()));
        console.log("================================");

        // Check if response is a redirect (3xx status)
        if (response.redirected) {
          // Backend did a redirect, let the browser follow it
          console.log("Backend redirected to:", response.url);
          window.location.href = response.url;
          return;
        }

        // Check if response status indicates redirect
        if (response.status >= 300 && response.status < 400) {
          const redirectUrl = response.headers.get("Location");
          console.log("Redirect status code detected:", response.status);
          console.log("Location header:", redirectUrl);
          if (redirectUrl) {
            console.log("Backend redirect header:", redirectUrl);
            window.location.href = redirectUrl;
            return;
          }
        }

        if (!response.ok) {
          console.error(
            "Response not OK:",
            response.status,
            response.statusText
          );
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("=== Google OAuth callback response data ===");
        console.log("Full response data:", JSON.stringify(data, null, 2));
        console.log("Success:", data.success);
        console.log("AccessToken present:", !!data.accessToken);
        console.log("User:", data.user);
        console.log("Redirect URL:", data.redirectUrl || data.redirect);
        console.log("===========================================");

        if (data.success && data.accessToken) {
          // Store tokens and user data (same as normal login)
          localStorage.setItem("login-accessToken", data.accessToken);
          if (data.refreshToken) {
            localStorage.setItem("refreshToken", data.refreshToken);
          }
          if (data.user) {
            localStorage.setItem("USER", JSON.stringify(data.user));
            console.log("User data stored:", data.user);
          }

          // Let backend handle redirect - check for redirect URL in response
          if (data.redirectUrl || data.redirect) {
            // Backend provides redirect URL, use it
            window.location.href = data.redirectUrl || data.redirect;
            return;
          }

          // If backend doesn't provide redirect in JSON, it might have done a server-side redirect
          // But if we got here, it didn't redirect, so fallback to home
          router.push("/");
          setLoading(false);
        } else {
          // Check if backend provides a fallback redirect on error
          if (data.redirectUrl || data.redirect) {
            window.location.href = data.redirectUrl || data.redirect;
            return;
          }

          setError(data.message || "Authentication failed. Please try again.");
          setLoading(false);
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
        }
      } catch (err) {
        console.error("❌ Google OAuth callback error:", err);
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
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

export default function GoogleCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
          <div className="w-12 h-12 border-4 border-t-[var(--secondary)] border-gray-700 rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
