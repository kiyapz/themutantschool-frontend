import "./globals.css";
import { NotificationProvider } from "@/context/NotificationContext";
import { CartProvider } from "@/components/mutantcart/CartContext";
import SessionTimeoutProvider from "@/components/SessionTimeoutProvider";

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
          <NotificationProvider>
            <SessionTimeoutProvider>{children}</SessionTimeoutProvider>
          </NotificationProvider>
        </CartProvider>
      </body>
    </html>
  );
}
