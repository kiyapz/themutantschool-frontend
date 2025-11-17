
import { useEffect } from "react";

const Notification = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const baseClasses = "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white z-50 flex items-center";
  const typeClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <span className="mr-3">{message}</span>
      <button onClick={onClose} className="text-white">
        &times;
      </button>
    </div>
  );
};

export default Notification;

