"use client";
import { CartProvider } from "@/components/mutantcart/CartContext";

export default function MissionLayout({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
