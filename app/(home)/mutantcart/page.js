"use client";
import ShoppingCart from "@/components/cart/ShoppingCart";

const demoItems = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    by: "The Mutant School",
    price: 80.1,
    image: "/images/Rectangle 120.png",
  },
  {
    id: "2",
    title: "JavaScript Fundamentals",
    by: "The Mutant School",
    price: 120.15,
    image: "/images/Rectangle 158.png",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen px pt-[120px]">
      <ShoppingCart items={demoItems} />
    </main>
  );
}
