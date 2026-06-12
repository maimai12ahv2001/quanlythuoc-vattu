import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  CalendarClock,
  ClipboardList,
  Menu,
  X,
  Pill,
  Bell,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { id: "inventory", label: "Quản lý Kho", icon: Package },
  { id: "expiry", label: "Theo dõi Hạn dùng", icon: CalendarClock },
  { id: "ordering", label: "Lên dự trù", icon: ClipboardList },
];

interface LayoutProps {
  activePage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

export function Layout({ activePage, onNavigate, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const activeLabel = navItems.find((n) => n.id === activePage)?.label ?? "";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-sidebar transition-all duration-300 shrink-0 ${sidebarOpen ? "w-60" : "w-16"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shrink-0">
            <Pill size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-white text-sm leading-tight truncate">PharmTrack</p>
              <p className="text-sidebar-foreground/50 text-[11px] truncate">Quản lý kho thuốc</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activePage === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                  active
                    ? "bg-sidebar-accent text-white"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && <span className="truncate">{label}</span>}
                {sidebarOpen && active && <ChevronRight size={14} className="ml-auto shrink-0 opacity-60" />}
              </button>
            );
          })}
        </nav>

        {/* Toggle */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-sidebar-foreground/60 hover:text-white hover:bg-sidebar-accent/50 transition-colors"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-foreground">{activeLabel}</h1>
            <p className="text-muted-foreground text-xs">
              Hệ thống quản lý xuất nhập tồn thuốc
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell size={18} className="text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-xs">DT</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm leading-tight">Dược sĩ Thảo</p>
                <p className="text-xs text-muted-foreground">Quản trị viên</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
