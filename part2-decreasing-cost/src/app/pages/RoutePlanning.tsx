import { useState } from "react";
import { Link } from "react-router";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { TrendingDown } from "lucide-react";
import { RouteMap } from "../components/RouteMap";
import { useRoutes, DEPOT_ADDRESS } from "../context/RoutesContext";
import type { RouteStop } from "../context/RoutesContext";

export function RoutePlanning() {
  const { routes } = useRoutes();
  const [selectedTech, setSelectedTech] = useState(0);
  const currentRoute = routes[selectedTech];

  const totalSaved = routes.reduce((sum, route) => sum + route.savedMiles, 0);

  const getStatusColor = (status: RouteStop["status"]) => {
    switch (status) {
      case "completed":
        return "bg-accent/10 text-accent border-accent/20";
      case "in-progress":
        return "bg-chart-3/10 text-chart-3 border-chart-3/20";
      case "scheduled":
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusLabel = (status: RouteStop["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "scheduled":
        return "Scheduled";
    }
  };

  if (!currentRoute) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">AI Route Planning</h1>
        <p className="text-muted-foreground">
          Optimized routes using exact permutation solver to minimize drive time
        </p>
      </div>

      {/* Route Optimization Summary */}
      <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-accent/10">
            <TrendingDown className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">
              Total miles saved today
            </p>
            <p className="text-2xl font-semibold text-accent mb-1">
              {totalSaved.toFixed(1)} mi across {routes.length} routes
            </p>
            <p className="text-xs text-muted-foreground mt-2 max-w-2xl">
              <strong>How it works:</strong> Jobs come in throughout the day in
              random order. The AI optimizer evaluates every possible stop
              permutation (exact solution for ≤8 stops, 2-opt improved for
              larger routes) to find the true shortest path from depot — something
              Google Maps can't do automatically with multiple waypoints. The
              "saved" miles is the difference between the original scheduling
              order and the mathematically optimal visit order.
            </p>
          </div>
        </div>
      </Card>

      {/* Technician Tabs */}
      <div className="flex gap-2 flex-wrap">
        {routes.map((route, index) => (
          <button
            key={route.name}
            onClick={() => setSelectedTech(index)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all
              ${
                selectedTech === index
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card hover:bg-muted text-foreground border border-border"
              }
            `}
          >
            {route.name} ({route.stops.length} stops)
          </button>
        ))}
      </div>

      {/* Route Details */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-start justify-between">
            <div>
              <Link to={`/technician/${currentRoute.id}`}>
                <h2 className="text-xl font-semibold mb-1 hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-2">
                  {currentRoute.name}
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    View Profile
                  </Badge>
                </h2>
              </Link>
              <p className="text-sm text-muted-foreground capitalize">
                Specialty: {currentRoute.specialty}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm text-muted-foreground">Original:</span>
                <span className="text-lg font-semibold text-destructive line-through">
                  {currentRoute.originalMiles.toFixed(1)} mi
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm text-muted-foreground">Optimized:</span>
                <span className="text-lg font-semibold text-accent">
                  {currentRoute.optimizedMiles.toFixed(1)} mi
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-muted-foreground">Saved:</span>
                <span className="text-lg font-semibold text-accent">
                  {currentRoute.savedMiles.toFixed(1)} mi ({currentRoute.savedMiles > 0 ? ((currentRoute.savedMiles / currentRoute.originalMiles) * 100).toFixed(0) : 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">Stop</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="text-right">Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRoute.stops.map((stop) => (
                <TableRow key={stop.stop} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {stop.stop}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{stop.customer}</TableCell>
                  <TableCell>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary hover:underline transition-colors"
                    >
                      {stop.address}
                    </a>
                  </TableCell>
                  <TableCell>{stop.service}</TableCell>
                  <TableCell className="text-right">{stop.duration} min</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(stop.status)}>
                      {getStatusLabel(stop.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Route Map */}
      <RouteMap
        stops={currentRoute.stops}
        technicianName={currentRoute.name}
        depotAddress={DEPOT_ADDRESS}
      />
    </div>
  );
}
