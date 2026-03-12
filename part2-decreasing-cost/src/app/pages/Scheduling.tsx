import { useState } from "react";
import { Link } from "react-router";
import { KPICard } from "../components/KPICard";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Truck, Play, Square, Wrench, ChevronRight } from "lucide-react";
import {
  useRoutes,
  TECHNICIAN_CONFIGS,
  haversine,
  DEPOT_LAT,
  DEPOT_LNG,
  type RouteStop,
} from "../context/RoutesContext";

const BUFFER_MINUTES = 30; // 30-min window between jobs
const MINUTES_PER_MILE = 3; // ~20 mph average in-town driving

// Generate realistic time slots accounting for actual drive times + buffer
function generateTimeSlots(stops: RouteStop[]): { arrival: string; driveMin: number }[] {
  const startHour = 8;
  const startMin = 0;
  const slots: { arrival: string; driveMin: number }[] = [];
  let currentMin = startHour * 60 + startMin;

  for (let i = 0; i < stops.length; i++) {
    // Drive time from previous location (depot for first stop)
    const fromLat = i === 0 ? DEPOT_LAT : stops[i - 1].lat;
    const fromLng = i === 0 ? DEPOT_LNG : stops[i - 1].lng;
    const dist = haversine(fromLat, fromLng, stops[i].lat, stops[i].lng);
    const driveMin = Math.round(dist * MINUTES_PER_MILE);

    // Add drive time to get arrival
    currentMin += driveMin;

    const h = Math.floor(currentMin / 60);
    const m = currentMin % 60;
    slots.push({
      arrival: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
      driveMin,
    });

    // After service, add buffer before next drive starts
    currentMin += stops[i].duration + BUFFER_MINUTES;
  }
  return slots;
}

export function Scheduling() {
  const { routes } = useRoutes();
  const [selectedTech, setSelectedTech] = useState(0);

  const currentRoute = routes[selectedTech];
  const techConfig = TECHNICIAN_CONFIGS[selectedTech];

  if (!currentRoute || !techConfig) return null;

  const timeSlots = generateTimeSlots(currentRoute.stops);

  const totalServiceTime = currentRoute.stops.reduce((sum, s) => sum + s.duration, 0);
  const totalDriveTime = timeSlots.reduce((sum, s) => sum + s.driveMin, 0);
  const totalBufferTime = Math.max(0, (currentRoute.stops.length - 1) * BUFFER_MINUTES);
  const totalWorkMins = totalServiceTime + totalDriveTime + totalBufferTime;
  const utilization = Math.round((totalWorkMins / 480) * 100); // 480 = 8-hour day in minutes

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-accent/10 text-accent border-accent/20";
      case "in-progress":
        return "bg-chart-3/10 text-chart-3 border-chart-3/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      default:
        return "Scheduled";
    }
  };

  // Count by status
  const doneCount = currentRoute.stops.filter((s) => s.status === "completed").length;
  const activeCount = currentRoute.stops.filter((s) => s.status === "in-progress").length;
  const upcomingCount = currentRoute.stops.filter((s) => s.status === "scheduled").length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Scheduling & Asset Optimization</h1>
        <p className="text-muted-foreground">
          Technician workload and vehicle utilization for today
        </p>
      </div>

      {/* Vehicle Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Vehicles"
          value="23"
          icon={Truck}
          iconColor="text-primary"
        />
        <KPICard
          title="Active (In Field)"
          value={String(routes.length)}
          icon={Play}
          iconColor="text-accent"
        />
        <KPICard
          title="Idle at Depot"
          value={String(23 - routes.length - 11)}
          icon={Square}
          iconColor="text-warning"
        />
        <KPICard
          title="In Maintenance"
          value="11"
          icon={Wrench}
          iconColor="text-destructive"
        />
      </div>

      {/* Technician Schedule View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - Technician List */}
        <Card className="lg:col-span-4 p-4 h-fit">
          <h2 className="text-lg font-semibold mb-4 px-2">Technicians</h2>
          <div className="space-y-2">
            {routes.map((route, index) => {
              const config = TECHNICIAN_CONFIGS[index];
              const slots = generateTimeSlots(route.stops);
              const svcTime = route.stops.reduce((s, st) => s + st.duration, 0);
              const drvTime = slots.reduce((s, sl) => s + sl.driveMin, 0);
              const bufTime = Math.max(0, (route.stops.length - 1) * BUFFER_MINUTES);
              const util = Math.round(((svcTime + drvTime + bufTime) / 480) * 100);
              return (
                <button
                  key={route.id}
                  onClick={() => setSelectedTech(index)}
                  className={`
                    w-full p-4 rounded-lg text-left transition-all
                    flex items-center justify-between
                    ${
                      selectedTech === index
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/30 hover:bg-muted"
                    }
                  `}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{route.name}</p>
                    <p
                      className={`text-sm capitalize ${
                        selectedTech === index
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {config?.specialty ?? route.specialty}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-xs ${
                          selectedTech === index
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {util}% utilized · {route.stops.length} jobs
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 ${
                      selectedTech === index
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </Card>

        {/* Right Side - Schedule Details */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold">{currentRoute.name}</h2>
                    <Link to={`/technician/${currentRoute.id}`}>
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20 cursor-pointer hover:bg-primary/20"
                      >
                        View Profile
                      </Badge>
                    </Link>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize mb-3">
                    {techConfig.specialty} | {techConfig.vehicle}
                  </p>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                      {doneCount} done
                    </Badge>
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                      {activeCount} active
                    </Badge>
                    <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                      {upcomingCount} upcoming
                    </Badge>
                  </div>
                </div>
                <div className="text-right min-w-[200px]">
                  <p className="text-sm text-muted-foreground mb-2">Utilization</p>
                  <p className="text-2xl font-semibold mb-2">{utilization}%</p>
                  <Progress value={utilization} className="h-2 bg-secondary" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {totalServiceTime} min service + {totalDriveTime} min drive + {totalBufferTime} min buffer
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-border">
              {currentRoute.stops.map((stop, index) => {
                const slot = timeSlots[index];
                return (
                  <div key={stop.stop}>
                    {/* Drive time indicator */}
                    {slot && slot.driveMin > 0 && (
                      <div className="px-6 py-2 bg-muted/10 flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="min-w-[60px]" />
                        <Truck className="w-3.5 h-3.5" />
                        <span>
                          {slot.driveMin} min drive from {index === 0 ? "depot" : `Stop ${index}`}
                        </span>
                      </div>
                    )}
                    <div className="p-6 hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-6">
                        <div className="text-center min-w-[60px]">
                          <p className="text-2xl font-semibold">{slot?.arrival ?? "--:--"}</p>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold mb-1">{stop.customer}</p>
                          <p className="text-sm text-muted-foreground">{stop.service}</p>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-primary hover:underline"
                          >
                            {stop.address}
                          </a>
                        </div>
                        <div className="text-right min-w-[100px]">
                          <p className="text-sm font-medium">{stop.duration} min service</p>
                          {index < currentRoute.stops.length - 1 && (
                            <p className="text-xs text-muted-foreground mt-1">+{BUFFER_MINUTES} min buffer</p>
                          )}
                        </div>
                        <div className="min-w-[120px]">
                          <Badge variant="outline" className={getStatusColor(stop.status)}>
                            {getStatusLabel(stop.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
