"use client";
import { createContext, useState, useContext, useCallback } from "react";

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000); // Notification disappears after 5 seconds
  }, []);

  const baseStyle =
    "fixed top-24 right-4 px-4 py-2 rounded shadow-lg z-50 text-white transition-all duration-300";
  let typeStyle = "";

  switch (notification?.type) {
    case "success":
      typeStyle = "bg-green-600";
      break;
    case "error":
      typeStyle = "bg-red-600";
      break;
    case "info":
      typeStyle = "bg-blue-500";
      break;
    default:
      typeStyle = "bg-gray-700";
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div className={`${baseStyle} ${typeStyle}`}>
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
}
