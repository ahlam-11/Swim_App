"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import AppNav from "@/app/components/AppNav";

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <AppNav />
      <main style={{ paddingTop: 64 }} className="pb-20 lg:pb-0">
        {children}
      </main>
    </SessionProvider>
  );
}
