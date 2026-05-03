"use client";

import { usePathname } from "next/navigation";
import AppNav from "@/app/components/AppNav";

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <>
      <AppNav />
      <main style={{ paddingTop: 64 }} className="pb-20 lg:pb-0">
        {children}
      </main>
    </>
  );
}
