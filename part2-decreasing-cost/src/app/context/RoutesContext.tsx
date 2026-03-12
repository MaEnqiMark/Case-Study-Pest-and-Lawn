import { createContext, useContext, useState, useCallback, ReactNode } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

export interface RouteStop {
  stop: number;
  customer: string;
  address: string;
  service: string;
  duration: number;
  status: "completed" | "scheduled" | "in-progress";
  lat: number;
  lng: number;
}

export interface TechnicianRoute {
  id: string;
  name: string;
  specialty: string;
  stops: RouteStop[];
  originalMiles: number;
  optimizedMiles: number;
  savedMiles: number;
}

export interface ServiceLocation {
  id: string;
  customer: string;
  address: string;
  lat: number;
  lng: number;
  serviceType: string;
  frequency: string;
  assignedTech: string;
  status: "active" | "pending" | "new";
  notes: string;
}

interface RoutesContextType {
  routes: TechnicianRoute[];
  locations: ServiceLocation[];
  addLocation: (location: Omit<ServiceLocation, "id" | "status">) => void;
  removeLocation: (id: string) => void;
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined);

// ── Depot ──────────────────────────────────────────────────────────────────

export const DEPOT_ADDRESS = "615 N Porter Ave, Norman, OK 73071";
export const DEPOT_LAT = 35.2269;
export const DEPOT_LNG = -97.4412;

// ── Geocoding (OpenStreetMap Nominatim — free, no API key) ─────────────────

export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      { headers: { "User-Agent": "PestLawnOpsDemo/1.0" } }
    );
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch {
    return null;
  }
}

// ── Haversine distance (miles) ─────────────────────────────────────────────

export function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Route distance calculation ─────────────────────────────────────────────

function totalRouteDistance(stops: { lat: number; lng: number }[]): number {
  if (stops.length === 0) return 0;
  let dist = haversine(DEPOT_LAT, DEPOT_LNG, stops[0].lat, stops[0].lng);
  for (let i = 0; i < stops.length - 1; i++) {
    dist += haversine(stops[i].lat, stops[i].lng, stops[i + 1].lat, stops[i + 1].lng);
  }
  return dist;
}

// ── Precompute distance matrix ─────────────────────────────────────────────

function buildDistanceMatrix(stops: { lat: number; lng: number }[]): number[][] {
  const n = stops.length;
  // Index 0 = depot, indices 1..n = stops
  const matrix: number[][] = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= n; i++) {
    for (let j = i + 1; j <= n; j++) {
      const latI = i === 0 ? DEPOT_LAT : stops[i - 1].lat;
      const lngI = i === 0 ? DEPOT_LNG : stops[i - 1].lng;
      const latJ = j === 0 ? DEPOT_LAT : stops[j - 1].lat;
      const lngJ = j === 0 ? DEPOT_LNG : stops[j - 1].lng;
      const d = haversine(latI, lngI, latJ, lngJ);
      matrix[i][j] = d;
      matrix[j][i] = d;
    }
  }
  return matrix;
}

function routeDistanceFromMatrix(order: number[], matrix: number[][]): number {
  if (order.length === 0) return 0;
  // order contains 1-based stop indices; depot = 0
  let dist = matrix[0][order[0]];
  for (let i = 0; i < order.length - 1; i++) {
    dist += matrix[order[i]][order[i + 1]];
  }
  return dist;
}

// ── Brute-force optimal (for ≤ 8 stops) ───────────────────────────────────

function permutations(arr: number[]): number[][] {
  if (arr.length <= 1) return [arr];
  const result: number[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of permutations(rest)) {
      result.push([arr[i], ...perm]);
    }
  }
  return result;
}

function bruteForceOptimize(indices: number[], matrix: number[][]): number[] {
  let bestOrder = indices;
  let bestDist = Infinity;
  for (const perm of permutations(indices)) {
    const d = routeDistanceFromMatrix(perm, matrix);
    if (d < bestDist) {
      bestDist = d;
      bestOrder = perm;
    }
  }
  return bestOrder;
}

// ── Nearest-neighbor + 2-opt (for > 8 stops) ──────────────────────────────

function nearestNeighborOrder(indices: number[], matrix: number[][]): number[] {
  const remaining = new Set(indices);
  const result: number[] = [];
  let current = 0; // start at depot

  while (remaining.size > 0) {
    let nearestIdx = -1;
    let nearestDist = Infinity;
    for (const idx of remaining) {
      const d = matrix[current][idx];
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = idx;
      }
    }
    remaining.delete(nearestIdx);
    result.push(nearestIdx);
    current = nearestIdx;
  }
  return result;
}

function twoOptImprove(order: number[], matrix: number[][]): number[] {
  let best = [...order];
  let bestDist = routeDistanceFromMatrix(best, matrix);
  let improved = true;

  while (improved) {
    improved = false;
    for (let i = 0; i < best.length - 1; i++) {
      for (let j = i + 1; j < best.length; j++) {
        // Reverse the segment between i and j
        const newOrder = [
          ...best.slice(0, i),
          ...best.slice(i, j + 1).reverse(),
          ...best.slice(j + 1),
        ];
        const newDist = routeDistanceFromMatrix(newOrder, matrix);
        if (newDist < bestDist - 0.0001) {
          best = newOrder;
          bestDist = newDist;
          improved = true;
        }
      }
    }
  }
  return best;
}

// ── Main optimizer: exact for small, heuristic for large ───────────────────

function optimizeRoute<T extends { lat: number; lng: number }>(stops: T[]): T[] {
  if (stops.length <= 1) return [...stops].map((s, i) => ({ ...s, stop: i + 1 }));

  const matrix = buildDistanceMatrix(stops);
  // 1-based indices for stops
  const indices = stops.map((_, i) => i + 1);

  let bestOrder: number[];

  if (stops.length <= 8) {
    // Exact solution via brute force (8! = 40,320 — instant)
    bestOrder = bruteForceOptimize(indices, matrix);
  } else {
    // Nearest-neighbor seed → 2-opt improvement
    bestOrder = nearestNeighborOrder(indices, matrix);
    bestOrder = twoOptImprove(bestOrder, matrix);
  }

  // Map back to stops with renumbered stop order
  return bestOrder.map((idx, i) => ({ ...stops[idx - 1], stop: i + 1 }));
}

// ── Initial data ───────────────────────────────────────────────────────────

// All addresses are real, verified locations in Norman, OK
// Coordinates geocoded from OpenStreetMap Nominatim
const initialLocations: ServiceLocation[] = [
  // Mike Sanders — 3 stops (spread west-to-east across Norman)
  { id: "loc-1", customer: "James Whitfield", address: "2101 W Main St, Norman, OK 73069", lat: 35.2183, lng: -97.4724, serviceType: "7-Step Weed Control", frequency: "Monthly", assignedTech: "Mike Sanders", status: "active", notes: "" },
  { id: "loc-2", customer: "Linda Baker", address: "301 W Main St, Norman, OK 73069", lat: 35.2195, lng: -97.4469, serviceType: "7-Step Weed Control", frequency: "Monthly", assignedTech: "Mike Sanders", status: "active", notes: "" },
  { id: "loc-3", customer: "Laura Anderson", address: "1800 Beaumont Dr, Norman, OK 73071", lat: 35.2089, lng: -97.4154, serviceType: "7-Step Weed Control", frequency: "Quarterly", assignedTech: "Mike Sanders", status: "active", notes: "" },
  // Jake Wilson — 3 stops (commercial accounts)
  { id: "loc-4", customer: "Robert Chen", address: "3600 W Main St, Norman, OK 73072", lat: 35.2175, lng: -97.4948, serviceType: "ProPlus Commercial", frequency: "Monthly", assignedTech: "Jake Wilson", status: "active", notes: "Commercial account" },
  { id: "loc-5", customer: "Brookhaven Apartments", address: "2100 Classen Blvd, Norman, OK 73069", lat: 35.2011, lng: -97.4293, serviceType: "ProPlus Commercial", frequency: "Monthly", assignedTech: "Jake Wilson", status: "active", notes: "Multi-unit complex" },
  { id: "loc-6", customer: "Green Valley HOA", address: "3750 W Robinson St, Norman, OK 73072", lat: 35.2315, lng: -97.4961, serviceType: "ProPlus Commercial", frequency: "Monthly", assignedTech: "Jake Wilson", status: "active", notes: "" },
  // Carlos Ramirez — 3 stops (central Norman)
  { id: "loc-7", customer: "Patricia Moore", address: "225 E Gray St, Norman, OK 73069", lat: 35.2227, lng: -97.4421, serviceType: "Fertilization Service", frequency: "Bi-monthly", assignedTech: "Carlos Ramirez", status: "active", notes: "" },
  { id: "loc-8", customer: "David Thompson", address: "1000 E Lindsey St, Norman, OK 73071", lat: 35.2039, lng: -97.4385, serviceType: "Pest Treatment", frequency: "Quarterly", assignedTech: "Carlos Ramirez", status: "active", notes: "" },
  { id: "loc-9", customer: "Sarah Williams", address: "2500 Boardwalk St, Norman, OK 73069", lat: 35.2263, lng: -97.4797, serviceType: "Weed Control", frequency: "Monthly", assignedTech: "Carlos Ramirez", status: "active", notes: "" },
  // Derek Brown — 3 stops (spread across Norman)
  { id: "loc-10", customer: "Michael Johnson", address: "1001 Alameda St, Norman, OK 73071", lat: 35.2185, lng: -97.4277, serviceType: "General Pest Treatment", frequency: "Monthly", assignedTech: "Derek Brown", status: "active", notes: "" },
  { id: "loc-11", customer: "Emily Davis", address: "1160 12th Ave NE, Norman, OK 73071", lat: 35.2310, lng: -97.4234, serviceType: "Termite Inspection", frequency: "Annual", assignedTech: "Derek Brown", status: "active", notes: "Annual inspection contract" },
  { id: "loc-12", customer: "Christopher Lee", address: "1440 E Lindsey St, Norman, OK 73071", lat: 35.2038, lng: -97.4194, serviceType: "Rodent Control", frequency: "Quarterly", assignedTech: "Derek Brown", status: "active", notes: "" },
];

export interface TechConfig {
  id: string;
  name: string;
  specialty: string;
  vehicle: string;
  hireDate: string;
  certifications: string[];
}

export const TECHNICIAN_CONFIGS: TechConfig[] = [
  { id: "mike-sanders", name: "Mike Sanders", specialty: "pest specialist", vehicle: "2022 Ford F-150", hireDate: "January 15, 2021", certifications: ["State Pesticide License", "Commercial Pest Control", "Termite Treatment Certified"] },
  { id: "jake-wilson", name: "Jake Wilson", specialty: "pest specialist", vehicle: "2022 Ford F-150", hireDate: "March 3, 2022", certifications: ["State Pesticide License", "Commercial Pest Control"] },
  { id: "carlos-ramirez", name: "Carlos Ramirez", specialty: "lawn care specialist", vehicle: "2023 Chevrolet Silverado", hireDate: "June 10, 2020", certifications: ["Lawn Care Professional", "Fertilizer Application Certified", "Weed Management"] },
  { id: "derek-brown", name: "Derek Brown", specialty: "pest specialist", vehicle: "2021 Ford F-250", hireDate: "August 22, 2019", certifications: ["State Pesticide License", "Rodent Control Specialist", "Termite Treatment Certified"] },
];

// ── Build routes from locations ────────────────────────────────────────────

function buildRoutesFromLocations(locations: ServiceLocation[]): TechnicianRoute[] {
  return TECHNICIAN_CONFIGS.map((tech) => {
    const techLocations = locations.filter((l) => l.assignedTech === tech.name);

    // Build stops in original (scheduling) order
    const originalStops: RouteStop[] = techLocations.map((loc, i) => ({
      stop: i + 1,
      customer: loc.customer,
      address: loc.address,
      service: loc.serviceType,
      duration: 45, // default duration
      status: "scheduled" as const,
      lat: loc.lat,
      lng: loc.lng,
    }));

    // Calculate original distance (as scheduled)
    const originalMiles = totalRouteDistance(originalStops);

    // Optimize: brute-force exact for ≤8 stops, nearest-neighbor + 2-opt for larger
    const optimizedStops = optimizeRoute(originalStops);
    const optimizedMiles = totalRouteDistance(optimizedStops);

    const savedMiles = Math.max(0, originalMiles - optimizedMiles);

    return {
      id: tech.id,
      name: tech.name,
      specialty: tech.specialty,
      stops: optimizedStops,
      originalMiles: Math.round(originalMiles * 10) / 10,
      optimizedMiles: Math.round(optimizedMiles * 10) / 10,
      savedMiles: Math.round(savedMiles * 10) / 10,
    };
  });
}

// ── Provider ───────────────────────────────────────────────────────────────

export function RoutesProvider({ children }: { children: ReactNode }) {
  const [locations, setLocations] = useState<ServiceLocation[]>(initialLocations);
  const [routes, setRoutes] = useState<TechnicianRoute[]>(() =>
    buildRoutesFromLocations(initialLocations)
  );

  const recalculateRoutes = useCallback((updatedLocations: ServiceLocation[]) => {
    setRoutes(buildRoutesFromLocations(updatedLocations));
  }, []);

  const addLocation = useCallback(
    (loc: Omit<ServiceLocation, "id" | "status">) => {
      const newLoc: ServiceLocation = {
        ...loc,
        id: `loc-${Date.now()}`,
        status: "new",
      };
      const updated = [...locations, newLoc];
      setLocations(updated);
      recalculateRoutes(updated);
    },
    [locations, recalculateRoutes]
  );

  const removeLocation = useCallback(
    (id: string) => {
      const updated = locations.filter((l) => l.id !== id);
      setLocations(updated);
      recalculateRoutes(updated);
    },
    [locations, recalculateRoutes]
  );

  return (
    <RoutesContext.Provider value={{ routes, locations, addLocation, removeLocation }}>
      {children}
    </RoutesContext.Provider>
  );
}

export function useRoutes() {
  const ctx = useContext(RoutesContext);
  if (!ctx) throw new Error("useRoutes must be used within RoutesProvider");
  return ctx;
}
