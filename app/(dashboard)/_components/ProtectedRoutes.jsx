"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedUser = localStorage.getItem("USER");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (!allowedRoles.includes(parsedUser.role)) {
          router.push("/Login"); 
        }
      } catch (error) {
        console.error("Failed to parse user:", error);
        router.push("/Login");
      }
    } else {
      router.push("/Login");
    }

    setLoading(false);
  }, []);

  if (loading || !user) return null; 

  return children;
};

export default ProtectedRoute;
