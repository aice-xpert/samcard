"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";
import Footer from "./Footer";
import { UserProvider } from "@/contexts/UserContext";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboardRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  // Public card pages: any route that looks like /{slug} (not a known top-level route)
  const knownRoutes = [
    "/", "/login", "/signup", "/dashboard", "/pricing", "/features",
    "/solutions", "/blog", "/about-us", "/contact-us", "/testimonials",
    "/terms-and-services", "/privacy-policy", "/cookies-policy",
    "/forgot-password", "/check-email",
  ];
  const isPublicCardPage =
    !isDashboardRoute &&
    !knownRoutes.some(r => pathname === r || (r !== "/" && pathname.startsWith(r)));

  const showChrome = !isDashboardRoute && !isPublicCardPage;

  return (
    <UserProvider>
      {showChrome && <Navigation />}
      <main>{children}</main>
      {showChrome && <Footer />}
    </UserProvider>
  );
}