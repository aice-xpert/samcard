"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";
import Footer from "./Footer";
import { UserProvider } from "@/contexts/UserContext";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  return (
    <UserProvider>
      {!isDashboardRoute && <Navigation />}
      <main>{children}</main>
      {!isDashboardRoute && <Footer />}
    </UserProvider>
  );
}
