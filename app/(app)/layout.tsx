import AppNav from "@/app/components/AppNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <AppNav />
      <main style={{ flex: 1, minWidth: 0, paddingBottom: 80 /* mobile tab bar */ }}>
        {children}
      </main>
    </div>
  );
}
