import { Link } from "react-router";
import { TECHNICIAN_CONFIGS, useRoutes } from "../context/RoutesContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Users,
  Truck,
  Award,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  Wrench,
} from "lucide-react";

const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-purple-600",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function Technicians() {
  const { routes, locations } = useRoutes();

  const totalTechs = TECHNICIAN_CONFIGS.length;
  const activeToday = routes.filter((r) => r.stops.length > 0).length;
  const totalStops = routes.reduce((sum, r) => sum + r.stops.length, 0);
  const avgUtilization = Math.round(
    routes.reduce((sum, r) => {
      const svcTime = r.stops.reduce((s, st) => s + st.duration, 0);
      const drvTime = Math.round(r.optimizedMiles * 3);
      return sum + ((svcTime + drvTime) / 480) * 100;
    }, 0) / totalTechs
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-1">Technician Team</h1>
        <p className="text-muted-foreground">
          Manage team members, track performance, and view assignments
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Technicians</p>
                <p className="text-2xl font-bold">{totalTechs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 text-green-700">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Today</p>
                <p className="text-2xl font-bold">{activeToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Stops Today</p>
                <p className="text-2xl font-bold">{totalStops}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Utilization</p>
                <p className="text-2xl font-bold">{avgUtilization}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technician Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {TECHNICIAN_CONFIGS.map((tech, idx) => {
          const route = routes.find((r) => r.id === tech.id);
          const techLocations = locations.filter(
            (l) => l.assignedTech === tech.name
          );
          const stopsCount = route?.stops.length ?? 0;
          const optimizedMiles = route?.optimizedMiles ?? 0;
          const savedMiles = route?.savedMiles ?? 0;

          // Utilization calculation
          const svcTime = route
            ? route.stops.reduce((s, st) => s + st.duration, 0)
            : 0;
          const drvTime = route ? Math.round(route.optimizedMiles * 3) : 0;
          const utilization = Math.round(((svcTime + drvTime) / 480) * 100);

          return (
            <Card key={tech.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}
                  >
                    {getInitials(tech.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/technician/${tech.id}`}
                      className="text-lg font-semibold hover:underline"
                    >
                      {tech.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="capitalize">
                        {tech.specialty}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Hired {tech.hireDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="w-4 h-4" />
                    <span>{tech.vehicle}</span>
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-sm font-medium text-muted-foreground">
                    <Shield className="w-3.5 h-3.5" />
                    Certifications
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tech.certifications.map((cert) => (
                      <Badge key={cert} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Stops Today</p>
                    <p className="text-xl font-bold">{stopsCount}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">
                      Optimized Miles
                    </p>
                    <p className="text-xl font-bold">{optimizedMiles}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Miles Saved</p>
                    <p className="text-xl font-bold text-green-600">
                      {savedMiles}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">
                      Customers Assigned
                    </p>
                    <p className="text-xl font-bold">{techLocations.length}</p>
                  </div>
                </div>

                {/* Utilization Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Utilization</span>
                    <span className="font-medium">{utilization}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                </div>

                {/* View Profile Button */}
                <Link to={`/technician/${tech.id}`} className="block">
                  <Button variant="outline" className="w-full">
                    View Profile
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
