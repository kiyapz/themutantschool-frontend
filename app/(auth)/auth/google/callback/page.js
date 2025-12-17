"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const BACKEND_BASE_URL = "https://themutantschool-backend.onrender.com/api";

// Helper function to determine redirect path based on user role
const getRedirectPath = (role) => {
  if (role === "instructor") return "/instructor";
  if (role === "student") return "/student/dashboard";
  if (role === "affiliate") return "/affiliate";
  return "/";
};

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState(null);

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

        console.log("=== Google Auth Callback Hit ===");
        console.log("Full URL:", window.location.href);
        console.log(
          "All URL params:",
          Object.fromEntries(searchParams.entries())
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

        // Check if backend redirected with accessToken in URL params (backward compatibility)
        const accessToken = searchParams.get("accessToken");
        if (accessToken) {
          console.log("=== Backend redirected with accessToken in URL ===");

          // Extract user details from URL params
          const firstName = searchParams.get("firstName");
          const lastName = searchParams.get("lastName");
          const email = searchParams.get("email");
          const role = searchParams.get("role");
          const refreshToken = searchParams.get("refreshToken");

          // Store tokens
          try {
            localStorage.setItem("login-accessToken", accessToken);
            if (refreshToken) {
              localStorage.setItem("refreshToken", refreshToken);
            }
          } catch (storageError) {
            console.error("Error storing tokens:", storageError);
          }

          // Try to fetch full user profile from backend
          try {
            const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
            const userId = tokenPayload.id;

            const profileResponse = await fetch(
              `${BACKEND_BASE_URL}/user-profile/${userId}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                credentials: "include",
              }
            );

            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              const fullUser = profileData.data || profileData;
              localStorage.setItem("USER", JSON.stringify(fullUser));

              // Redirect based on role
              const redirectPath = getRedirectPath(fullUser.role);
              setLoading(false);
              setTimeout(() => {
                window.location.href = redirectPath;
              }, 100);
              return;
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }

          // Fallback: Build user object from URL params
          const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
          const user = {
            _id: tokenPayload.id,
            firstName: firstName || "",
            lastName: lastName || "",
            email: email || tokenPayload.email || "",
            role: role || tokenPayload.role || "",
          };

          localStorage.setItem("USER", JSON.stringify(user));
          const redirectPath = getRedirectPath(user.role);
          setLoading(false);
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 100);
          return;
        }

        // Get the OAuth authorization code from URL params
        const code = searchParams.get("code");
        if (!code) {
          console.error("❌ No authentication code received in URL params");
          setError("No authentication code received.");
          setLoading(false);
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
          return;
        }

        // Build query string with all OAuth params
        const queryParams = new URLSearchParams();
        queryParams.append("code", code);

        // Include other OAuth params if present
        const scope = searchParams.get("scope");
        const authuser = searchParams.get("authuser");
        const prompt = searchParams.get("prompt");
        if (scope) queryParams.append("scope", scope);
        if (authuser) queryParams.append("authuser", authuser);
        if (prompt) queryParams.append("prompt", prompt);

        // Call backend callback endpoint
        // Backend: GET /api/auth/google/callback
        // Backend returns JSON if Accept: application/json, otherwise redirects with URL params
        const backendCallbackUrl = `${BACKEND_BASE_URL}/auth/google/callback?${queryParams.toString()}`;
        console.log("=== Calling Backend Callback ===");
        console.log("URL:", backendCallbackUrl);
        console.log("Method: GET");
        console.log(
          "Expected Response (JSON): { user: {...}, accessToken: '<JWT_TOKEN>', redirect: '<URL>' }"
        );
        console.log(
          "OR Redirect (302): Frontend URL with accessToken, firstName, lastName, email, role params"
        );

        const response = await fetch(backendCallbackUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json", // Request JSON response from backend
          },
          credentials: "include",
          redirect: "manual", // Don't automatically follow redirects, handle them manually
        });

        // Log complete response details
        console.log("=== Backend Response Details ===");
        console.log("Status Code:", response.status);
        console.log("Status Text:", response.statusText);
        console.log("OK:", response.ok);
        console.log("Redirected:", response.redirected);
        console.log("Response URL:", response.url);

        // Log all response headers
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        console.log("Response Headers:", responseHeaders);
        console.log("================================");

        // Handle 302 Found - Redirect after authentication or redirect to /login on failure
        if (response.status === 302) {
          const locationHeader = response.headers.get("Location");
          console.log("📍 302 Redirect detected");
          console.log("Location header:", locationHeader);

          if (locationHeader) {
            setResponseData({
              status: 302,
              message: "Redirect after authentication",
              location: locationHeader,
            });

            // If backend redirects to /login, it means authentication failed
            if (
              locationHeader.includes("/login") ||
              locationHeader.includes("/auth/login")
            ) {
              console.log(
                "Backend redirected to login - authentication failed"
              );
              setError("Authentication failed. Please try again.");
              setLoading(false);
              setTimeout(() => {
                router.push("/auth/login");
              }, 2000);
              return;
            }

            // Otherwise, follow the redirect (could be redirect with tokens in URL)
            window.location.href = locationHeader;
            return;
          } else {
            throw new Error(
              "302 redirect received but no Location header found"
            );
          }
        }

        // Handle 401 Unauthorized - Authentication failed
        if (response.status === 401) {
          console.error("❌ 401 Unauthorized - Authentication failed");
          let errorData;
          try {
            const errorText = await response.text();
            errorData = errorText
              ? JSON.parse(errorText)
              : { message: "Unauthorized" };
            console.error("Error response:", errorData);
          } catch (e) {
            errorData = { message: "Authentication failed. Please try again." };
          }

          setResponseData({
            status: 401,
            message: "Unauthorized",
            error: errorData,
          });

          setError(
            errorData.message || "Authentication failed. Please try again."
          );
          setLoading(false);
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
          return;
        }

        // Handle 200 OK - Successful login with JWT returned
        if (response.status === 200) {
          console.log("✅ 200 OK - Successful authentication");

          let data;
          try {
            const responseText = await response.text();
            console.log("Raw response text:", responseText);

            if (responseText) {
              data = JSON.parse(responseText);
            } else {
              throw new Error("Empty response body");
            }
          } catch (parseError) {
            console.error("Error parsing JSON response:", parseError);
            throw new Error("Invalid JSON response from server");
          }

          // Log complete response data
          console.log("=== Response Data (200 OK) ===");
          console.log("Full response:", JSON.stringify(data, null, 2));
          console.log("AccessToken present:", !!data.accessToken);
          console.log("User present:", !!data.user);
          console.log("Redirect present:", !!data.redirect);
          if (data.user) {
            console.log("User role:", data.user.role);
            console.log("User email:", data.user.email);
            console.log("User structure:", {
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              username: data.user.username,
              email: data.user.email,
              role: data.user.role,
              isVerified: data.user.isVerified,
              hasProfile: !!data.user.profile,
            });
          }
          console.log("==============================");

          // Store response data for debugging
          setResponseData({
            status: 200,
            message: "OK - Successful login",
            data: data,
          });

          // Handle response according to backend implementation
          // Backend returns: { user: result.data, accessToken: result.accessToken, redirect: frontendRedirectUrl }
          if (data.accessToken && data.user) {
            console.log("✓ Response matches backend format");

            // Store tokens and user data (same as normal login)
            localStorage.setItem("login-accessToken", data.accessToken);

            // Note: Backend sets refreshToken in httpOnly cookie, not in response
            // It's automatically included in credentials: "include"

            // Store complete user object as returned by backend
            localStorage.setItem("USER", JSON.stringify(data.user));
            console.log("✓ Tokens and user data stored successfully");
            console.log("User role:", data.user.role);

            // Use redirect URL from backend if provided, otherwise use role-based redirect
            const redirectPath =
              data.redirect || getRedirectPath(data.user.role);
            console.log("Redirecting to:", redirectPath);
            setLoading(false);

            setTimeout(() => {
              window.location.href = redirectPath;
            }, 100);
          } else {
            // Authentication failed - response was 200 but missing required fields
            const errorMessage =
              data.message || "Authentication failed. Please try again.";
            console.error(
              "❌ Authentication failed - invalid response structure"
            );
            console.error("Expected: { accessToken, user, redirect }");
            console.error("Received:", data);
            setError(errorMessage);
            setLoading(false);
            setTimeout(() => {
              router.push("/auth/login");
            }, 3000);
          }
        } else {
          // Handle other status codes
          console.error(`❌ Unexpected status code: ${response.status}`);
          const errorText = await response.text();
          let errorData;
          try {
            errorData = errorText
              ? JSON.parse(errorText)
              : { message: `HTTP ${response.status} error` };
          } catch (e) {
            errorData = {
              message: errorText || `HTTP ${response.status} error`,
            };
          }

          console.error("Error response:", errorData);
          setResponseData({
            status: response.status,
            message: `HTTP ${response.status} ${response.statusText}`,
            error: errorData,
          });

          setError(errorData.message || `Server error: ${response.status}`);
          setLoading(false);
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
        }
      } catch (err) {
        console.error("❌ Google OAuth callback error:", err);
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
        {responseData && (
          <div className="mt-8 p-4 bg-gray-900 rounded-lg max-w-2xl w-full mx-4 text-left">
            <p className="text-sm text-gray-400 mb-2">Backend Response:</p>
            <pre className="text-xs text-green-400 overflow-auto max-h-96">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
        <div className="text-center max-w-md mb-8">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <p className="text-gray-400">Redirecting to login page...</p>
        </div>
        {responseData && (
          <div className="mt-4 p-4 bg-gray-900 rounded-lg max-w-2xl w-full text-left">
            <p className="text-sm text-gray-400 mb-2">Backend Response:</p>
            <pre className="text-xs text-red-400 overflow-auto max-h-96">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </div>
        )}
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
