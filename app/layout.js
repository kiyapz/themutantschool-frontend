import "./globals.css";
import { NotificationProvider } from "@/context/NotificationContext";
import { CartProvider } from "@/components/mutantcart/CartContext";

export const metadata = {
  title: "Mutant School",
  description:
    "Welcome to the Mutant School portal. Explore courses, connect with instructors, and stay updated.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <CartProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </CartProvider>
      </body>
    </html>
  );
}
