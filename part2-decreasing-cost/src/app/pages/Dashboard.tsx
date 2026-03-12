import { Link } from "react-router";
import { KPICard } from "../components/KPICard";
import { Card } from "../components/ui/card";
import {
  Briefcase,
  Users,
  Truck,
  AlertTriangle,
  Route,
  Calendar,
  Package,
  FileText,
  UserPlus,
  TrendingDown
} from "lucide-react";
import { useRoutes } from "../context/RoutesContext";
import { useInventory } from "../context/InventoryContext";
import { useReports } from "../context/ReportsContext";

export function Dashboard() {
  const { routes, locations } = useRoutes();
  const { inventory } = useInventory();
  const { reports } = useReports();

  // Live KPIs from context
  const totalJobs = routes.reduce((sum, r) => sum + r.stops.length, 0);
  const totalTechs = routes.length;

  // Utilization: avg across all techs
  const avgUtilization = Math.round(
    routes.reduce((sum, r) => {
      const svcTime = r.stops.reduce((s, st) => s + st.duration, 0);
      const drvTime = Math.round(r.optimizedMiles * 3);
      return sum + ((svcTime + drvTime) / 480) * 100;
    }, 0) / totalTechs
  );

  // Route savings
  const totalSaved = routes.reduce((sum, r) => sum + r.savedMiles, 0);

  // Inventory alerts
  const lowStockCount = inventory.filter((i) => i.status === "low" || i.status === "warning").length;

  // Reports filed today
  const reportsCount = reports.length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Operations Dashboard</h1>
        <p className="text-muted-foreground">
          Live overview of today's operations
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Today's Jobs"
          value={String(totalJobs)}
          description={`${totalTechs} techs · ${locations.length} customers`}
          icon={Briefcase}
          iconColor="text-primary"
        />
        <KPICard
          title="Avg Utilization"
          value={`${avgUtilization}%`}
          description="of 8-hour day"
          icon={Users}
          iconColor="text-chart-3"
        />
        <KPICard
          title="Reports Filed"
          value={String(reportsCount)}
          description="service reports today"
          icon={FileText}
          iconColor="text-chart-2"
        />
        <KPICard
          title="Low Stock Alerts"
          value={String(lowStockCount)}
          description={`${inventory.length} items tracked`}
          icon={AlertTriangle}
          iconColor={lowStockCount > 0 ? "text-destructive" : "text-accent"}
        />
      </div>

      {/* Route Optimization Savings */}
      <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-accent/10">
            <TrendingDown className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Route Optimization Savings</h3>
            <p className="text-2xl font-semibold text-accent mb-1">
              {totalSaved.toFixed(1)} miles saved today
            </p>
            <p className="text-sm text-muted-foreground">
              across {totalTechs} technician routes ({totalJobs} jobs)
            </p>
          </div>
        </div>
      </Card>

      {/* Navigation Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link to="/route-planning">
            <Card className="p-6 hover:shadow-lg transition-all hover:border-primary/40 cursor-pointer group">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-4 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <Route className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Route Planning</h3>
                  <p className="text-sm text-muted-foreground">
                    {totalSaved.toFixed(1)} mi saved
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/customers">
            <Card className="p-6 hover:shadow-lg transition-all hover:border-primary/40 cursor-pointer group">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-4 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <UserPlus className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Customers</h3>
                  <p className="text-sm text-muted-foreground">
                    {locations.length} customers
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/scheduling">
            <Card className="p-6 hover:shadow-lg transition-all hover:border-primary/40 cursor-pointer group">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-4 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Scheduling</h3>
                  <p className="text-sm text-muted-foreground">
                    {avgUtilization}% avg utilization
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/inventory">
            <Card className="p-6 hover:shadow-lg transition-all hover:border-primary/40 cursor-pointer group">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-4 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <Package className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Inventory</h3>
                  <p className="text-sm text-muted-foreground">
                    {lowStockCount > 0 ? `${lowStockCount} alerts` : "All stocked"}
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/reports">
            <Card className="p-6 hover:shadow-lg transition-all hover:border-primary/40 cursor-pointer group">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-4 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Tech Reports</h3>
                  <p className="text-sm text-muted-foreground">
                    {reportsCount} filed today
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
