import { NextRequest, NextResponse } from "next/server";
import { getTodaysJobs, getJobsByTechnician, getTechnicians } from "@/lib/db";

// Simple distance calculation (Haversine)
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Nearest-neighbor route optimization
function optimizeRoute(jobs: typeof allJobs) {
  if (jobs.length <= 1) return { optimizedJobs: jobs, totalMiles: 0, savedMiles: 0 };

  // Depot: company HQ in Norman
  const depot = { lat: 35.2226, lng: -97.4395 };

  // Original order distance
  let originalMiles = 0;
  let prev = depot;
  for (const job of jobs) {
    originalMiles += haversine(prev.lat, prev.lng, job.lat, job.lng);
    prev = { lat: job.lat, lng: job.lng };
  }
  originalMiles += haversine(prev.lat, prev.lng, depot.lat, depot.lng);

  // Nearest-neighbor optimization
  const remaining = [...jobs];
  const optimized: typeof jobs = [];
  let current = depot;
  let optimizedMiles = 0;

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = haversine(current.lat, current.lng, remaining[i].lat, remaining[i].lng);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    }
    optimizedMiles += nearestDist;
    current = { lat: remaining[nearestIdx].lat, lng: remaining[nearestIdx].lng };
    optimized.push(remaining[nearestIdx]);
    remaining.splice(nearestIdx, 1);
  }
  optimizedMiles += haversine(current.lat, current.lng, depot.lat, depot.lng);

  return {
    optimizedJobs: optimized.map((j, i) => ({ ...j, stopNumber: i + 1 })),
    originalMiles: Math.round(originalMiles * 10) / 10,
    optimizedMiles: Math.round(optimizedMiles * 10) / 10,
    savedMiles: Math.round((originalMiles - optimizedMiles) * 10) / 10,
    savingsPercent: Math.round(((originalMiles - optimizedMiles) / originalMiles) * 100),
  };
}

const allJobs = getTodaysJobs();

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const techId = searchParams.get("techId");

  if (techId) {
    const jobs = getJobsByTechnician(techId);
    const result = optimizeRoute(jobs);
    const tech = getTechnicians().find((t) => t.id === techId);
    return NextResponse.json({ technician: tech, ...result });
  }

  // All technicians' optimized routes
  const techs = getTechnicians();
  const routes = techs
    .map((tech) => {
      const jobs = getJobsByTechnician(tech.id);
      if (jobs.length === 0) return null;
      return { technician: tech, ...optimizeRoute(jobs) };
    })
    .filter(Boolean);

  const totalSaved = routes.reduce((s, r) => s + (r?.savedMiles ?? 0), 0);

  return NextResponse.json({
    totalTechnicians: routes.length,
    totalJobs: allJobs.length,
    totalMilesSaved: Math.round(totalSaved * 10) / 10,
    routes,
  });
}
