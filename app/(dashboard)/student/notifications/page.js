"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { IoNotificationsOutline, IoTrashOutline, IoCheckmarkCircle, IoArrowBack } from "react-icons/io5";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

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
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notification/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
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
        setUnreadCount((prev) => Math.max(0, prev - 1));
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--text)] hover:text-white transition-colors mb-4"
        >
          <IoArrowBack size={20} />
          <span>Back</span>
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-[600] text-[24px] sm:text-[32px] mb-2">
              Notifications
            </h1>
            <p className="text-[var(--text)] text-[14px]">
              {notifications.length} {notifications.length === 1 ? "notification" : "notifications"}
              {unreadCount > 0 && (
                <span className="ml-2 text-[var(--secondary)]">
                  ({unreadCount} unread)
                </span>
              )}
            </p>
          </div>
          
          {notifications.length > 0 && (
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white rounded-lg text-[14px] font-[500] transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={deleteAllNotifications}
                className="px-4 py-2 bg-transparent text-[var(--error)] hover:bg-[var(--error)] hover:text-white rounded-lg text-[14px] font-[500] transition-colors flex items-center gap-2"
              >
                <IoTrashOutline size={16} />
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-[var(--text-light)]">
            <div className="inline-block w-8 h-8 border-2 border-t-transparent border-[var(--primary)] rounded-full animate-spin"></div>
            <p className="mt-4 text-[var(--text)]">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-light)] bg-[var(--accent)] rounded-lg">
            <IoNotificationsOutline size={64} className="mx-auto mb-4 opacity-50 text-[var(--text)]" />
            <p className="text-[var(--text)] text-[18px] mb-2">No notifications yet</p>
            <p className="text-[var(--text-light)] text-[14px]">
              You&apos;ll see notifications here when you receive them
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => !notification.isRead && markAsRead(notification._id)}
              className={`p-5 bg-[var(--accent)] rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors cursor-pointer ${
                !notification.isRead ? "bg-[rgba(145,89,209,0.1)]" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    {notification.isRead ? (
                      <IoCheckmarkCircle 
                        size={20} 
                        className="text-[var(--success)] mt-1 flex-shrink-0" 
                      />
                    ) : (
                      <span className="w-3 h-3 bg-[var(--secondary)] rounded-full mt-2 flex-shrink-0"></span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-[600] text-[16px] mb-2">
                        {notification.title || "Notification"}
                      </p>
                      <p className="text-[var(--text)] text-[14px] mb-3 leading-relaxed">
                        {notification.message || notification.content || ""}
                      </p>
                      <p className="text-[var(--text-light)] text-[12px]">
                        {formatDate(notification.createdAt || notification.date)}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => deleteNotification(notification._id, e)}
                  className="text-[var(--text-light)] hover:text-[var(--error)] transition-colors flex-shrink-0 p-2 hover:bg-[rgba(255,255,255,0.05)] rounded"
                  title="Delete notification"
                >
                  <IoTrashOutline size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
