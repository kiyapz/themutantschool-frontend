import { GloblaxcontexProvider } from "@/context/Globlaxcontex";
import AuthNavBar from "../../-components/AuthNavBar";

export const metadata = {
  title: "Mutant School | Login Portal",
  description:
    "Sign in to the Mutant School portal to access your dashboard, assignments, and messages.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GloblaxcontexProvider>
          <AuthNavBar />
          {children}
        </GloblaxcontexProvider>
      </body>
    </html>
  );
}
