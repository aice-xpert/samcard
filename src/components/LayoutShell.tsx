"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";
import Footer from "./Footer";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  return (
    <>
      {!isDashboardRoute && <Navigation />}
      <main>{children}</main>
      {!isDashboardRoute && <Footer />}
    </>
  );
}
