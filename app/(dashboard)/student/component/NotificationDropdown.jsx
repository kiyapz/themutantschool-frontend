"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { IoNotificationsOutline, IoClose, IoTrashOutline, IoCheckmarkCircle } from "react-icons/io5";

export default function NotificationDropdown({ isOpen, onClose, onNotificationUpdate }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Determine notifications page route based on current path
  const notificationsRoute = pathname?.startsWith("/instructor") 
    ? "/instructor/notifications" 
    : pathname?.startsWith("/affiliate")
    ? "/affiliate/notifications"
    : "/student/notifications";
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const hasFetchedRef = useRef(false);
  
  // Show only first 3 notifications in dropdown
  const displayedNotifications = notifications.slice(0, 3);
  const hasMoreNotifications = notifications.length > 3;

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/notification");
      const notificationsData = response.data?.data || response.data || [];
      setNotifications(notificationsData);
      
      // Count unread notifications
      const unread = notificationsData.filter((notif) => !notif.isRead).length;
      setUnreadCount(unread);
      
      // Notify parent component
      if (onNotificationUpdate) {
        onNotificationUpdate(unread);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [onNotificationUpdate]);

  // Close dropdown when clicking outside and fetch notifications when opened
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Fetch notifications only once when dropdown opens
      if (!hasFetchedRef.current) {
        hasFetchedRef.current = true;
        fetchNotifications();
      }
    } else {
      // Reset fetch flag when dropdown closes so it fetches fresh data next time
      hasFetchedRef.current = false;
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, onClose]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notification/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      const newCount = Math.max(0, unreadCount - 1);
      setUnreadCount(newCount);
      if (onNotificationUpdate) {
        onNotificationUpdate(newCount);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await api.put("/notification/mark-all-read");
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
      if (onNotificationUpdate) {
        onNotificationUpdate(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/notification/${notificationId}`);
      const deletedNotif = notifications.find((n) => n._id === notificationId);
      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
      if (deletedNotif && !deletedNotif.isRead) {
        const newCount = Math.max(0, unreadCount - 1);
        setUnreadCount(newCount);
        if (onNotificationUpdate) {
          onNotificationUpdate(newCount);
        }
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Delete all notifications
  const deleteAllNotifications = async () => {
    try {
      await api.delete("/notification");
      setNotifications([]);
      setUnreadCount(0);
      if (onNotificationUpdate) {
        onNotificationUpdate(0);
      }
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      
      return date.toLocaleDateString();
    } catch (error) {
      return "Recently";
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full mt-2 w-[calc(100vw-16px)] max-w-[320px] sm:max-w-[400px] sm:w-[400px] max-h-[calc(100vh-120px)] sm:max-h-[500px] bg-[var(--accent)] rounded-lg shadow-xl z-50 overflow-hidden"
      style={{
        right: '8px',
        left: 'auto'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 sm:p-4 border-b border-[rgba(255,255,255,0.1)]">
        <h3 className="text-white font-[600] text-sm sm:text-[18px] truncate flex-1 min-w-0">Notifications</h3>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {notifications.length > 0 && unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[var(--secondary)] text-[10px] sm:text-[12px] hover:underline whitespace-nowrap"
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={deleteAllNotifications}
              className="text-[var(--error)] text-[10px] sm:text-[12px] hover:text-[var(--error)] hover:opacity-80 transition-colors flex items-center gap-0.5 sm:gap-1"
              title="Clear all"
            >
              <IoTrashOutline size={12} className="sm:w-[14px] sm:h-[14px]" />
              <span className="hidden sm:inline">Clear all</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="text-white hover:text-[var(--text)] transition-colors p-0.5"
            title="Close"
          >
            <IoClose size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto max-h-[calc(100vh-180px)] sm:max-h-[400px] scrollbar-hide">
        {loading ? (
          <div className="p-4 sm:p-8 text-center text-[var(--text-light)]">
            <div className="inline-block w-5 h-5 sm:w-6 sm:h-6 border-2 border-t-transparent border-[var(--primary)] rounded-full animate-spin"></div>
            <p className="mt-2 text-[var(--text)] text-xs sm:text-sm">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 sm:p-8 text-center text-[var(--text-light)]">
            <IoNotificationsOutline size={36} className="sm:w-12 sm:h-12 mx-auto mb-2 opacity-50 text-[var(--text)]" />
            <p className="text-[var(--text)] text-xs sm:text-sm">No notifications yet</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-[rgba(255,255,255,0.1)]">
              {displayedNotifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => !notification.isRead && markAsRead(notification._id)}
                  className={`p-2 sm:p-4 hover:bg-[rgba(255,255,255,0.05)] transition-colors cursor-pointer ${
                    !notification.isRead ? "bg-[rgba(255,255,255,0.03)]" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-1.5 sm:gap-2">
                        {notification.isRead ? (
                          <IoCheckmarkCircle 
                            size={16} 
                            className="sm:w-[18px] sm:h-[18px] text-[var(--success)] mt-0.5 sm:mt-1 flex-shrink-0" 
                          />
                        ) : (
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--secondary)] rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-[500] text-xs sm:text-[14px] mb-0.5 sm:mb-1 break-words">
                            {notification.title || "Notification"}
                          </p>
                          <p className="text-[var(--text)] text-[10px] sm:text-[12px] line-clamp-2 break-words">
                            {notification.message || notification.content || ""}
                          </p>
                          <p className="text-[var(--text-light)] text-[9px] sm:text-[10px] mt-1 sm:mt-2">
                            {formatDate(notification.createdAt || notification.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => deleteNotification(notification._id, e)}
                      className="text-[var(--text-light)] hover:text-[var(--error)] transition-colors flex-shrink-0 ml-1 sm:ml-2 p-0.5 sm:p-1"
                      title="Delete notification"
                    >
                      <IoTrashOutline size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {notifications.length > 0 && (
              <div className="p-2 sm:p-4 border-t border-[rgba(255,255,255,0.1)]">
                <Link
                  href={notificationsRoute}
                  onClick={onClose}
                  className="w-full text-center block text-[var(--secondary)] hover:text-[var(--primary)] font-[500] text-xs sm:text-[14px] transition-colors break-words"
                >
                  View all notifications {hasMoreNotifications && `(${notifications.length})`}
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

