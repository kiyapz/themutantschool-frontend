"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";

const INACTIVITY_LIMIT_MS = 20 * 60 * 1000; // 20 minutes
const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "wheel",
  "pointermove",
];

export default function SessionTimeoutProvider({ children }) {
  const router = useRouter();
  const notificationApi = useNotification?.();
  const timeoutIdRef = useRef(null);
  const hasTimedOutRef = useRef(false);

  const clearExistingTimeout = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);

  const redirectToLogin = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (notificationApi?.showNotification) {
      notificationApi.showNotification(
        "You have been logged out due to inactivity.",
        "info"
      );
    }

    router.push("/auth/login");
  }, [notificationApi, router]);

  const clearAuthStorage = useCallback(() => {
    try {
      localStorage.removeItem("login-accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("USER");
    } catch (error) {
      console.error("Failed to clear auth storage after inactivity:", error);
    }
  }, []);

  const logoutUser = useCallback(() => {
    if (hasTimedOutRef.current) {
      return;
    }

    hasTimedOutRef.current = true;
    clearExistingTimeout();
    clearAuthStorage();
    redirectToLogin();
  }, [clearAuthStorage, clearExistingTimeout, redirectToLogin]);

  const startInactivityTimer = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const isAuthenticated = Boolean(
      localStorage.getItem("login-accessToken") ||
        localStorage.getItem("refreshToken")
    );

    hasTimedOutRef.current = false;

    if (!isAuthenticated) {
      clearExistingTimeout();
      return;
    }

    clearExistingTimeout();
    timeoutIdRef.current = window.setTimeout(
      logoutUser,
      INACTIVITY_LIMIT_MS
    );
  }, [clearExistingTimeout, logoutUser]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleActivity = () => {
      if (hasTimedOutRef.current) {
        return;
      }

      startInactivityTimer();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleActivity();
      }
    };

    const handleWindowFocus = () => {
      handleActivity();
    };

    const handleStorageChange = (event) => {
      if (
        event.key === "login-accessToken" ||
        event.key === "refreshToken" ||
        event.key === "USER"
      ) {
        startInactivityTimer();
      }
    };

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("storage", handleStorageChange);

    startInactivityTimer();

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity, {
          passive: true,
        });
      });
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorageChange);
      clearExistingTimeout();
    };
  }, [clearExistingTimeout, startInactivityTimer]);

  return children;
}

