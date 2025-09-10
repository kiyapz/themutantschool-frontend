"use client";
import { useEffect, useState } from "react";
import ShoppingCart from "@/components/cart/ShoppingCart";

export default function Page() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("CART_ITEMS") || "[]");
      setItems(Array.isArray(stored) ? stored : []);
    } catch (e) {
      setItems([]);
    }
  }, []);

  const handleRemove = (id) => {
    try {
      const stored = JSON.parse(localStorage.getItem("CART_ITEMS") || "[]");
      const next = stored.filter((x) => x.id !== id);
      localStorage.setItem("CART_ITEMS", JSON.stringify(next));
      setItems(next);
      window.dispatchEvent(new CustomEvent("cart:changed"));
    } catch (e) {}
  };

  return (
    <main className="min-h-screen px pt-[120px]">
      <ShoppingCart items={items} onRemove={handleRemove} />
    </main>
  );
}
