import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Route,
  UserPlus,
  Users,
  Calendar,
  Package,
  FileText,
  TrendingUp
} from "lucide-react";

export function RootLayout() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/route-planning", label: "Route Planning", icon: Route },
    { path: "/customers", label: "Customers", icon: UserPlus },
    { path: "/technicians", label: "Technicians", icon: Users },
    { path: "/scheduling", label: "Scheduling", icon: Calendar },
    { path: "/inventory", label: "Inventory", icon: Package },
    { path: "/reports", label: "Tech Reports", icon: FileText },
    { path: "/forecasting", label: "Forecasting", icon: TrendingUp },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-primary text-primary-foreground shadow-sm sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">Pest & Lawn Ops</h1>
          </div>
        </div>
        <nav className="px-6 border-t border-primary-foreground/10">
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium
                    transition-colors relative
                    ${
                      active
                        ? "text-white"
                        : "text-primary-foreground/70 hover:text-primary-foreground/90"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {active && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}