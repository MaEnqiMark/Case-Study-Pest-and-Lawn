import { NextResponse } from "next/server";
import { getTodaysJobs, getTechnicians, getVehicles } from "@/lib/db";

export async function GET() {
  const jobs = getTodaysJobs();
  const techs = getTechnicians();
  const vehicles = getVehicles();

  // Build schedule per technician
  const schedule = techs.map((tech) => {
    const techJobs = jobs
      .filter((j) => j.assignedTech === tech.id)
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

    const vehicle = vehicles.find((v) => v.assignedTo === tech.id);

    const totalMinutes = techJobs.reduce((s, j) => s + j.estimatedDuration, 0);
    const completed = techJobs.filter((j) => j.status === "completed").length;
    const inProgress = techJobs.filter((j) => j.status === "in-progress").length;

    // Estimate drive time (15 min avg between stops)
    const driveMinutes = Math.max(0, techJobs.length - 1) * 15;

    return {
      technician: tech,
      vehicle: vehicle ?? null,
      jobs: techJobs,
      stats: {
        totalJobs: techJobs.length,
        completed,
        inProgress,
        scheduled: techJobs.length - completed - inProgress,
        totalServiceMinutes: totalMinutes,
        estimatedDriveMinutes: driveMinutes,
        totalWorkMinutes: totalMinutes + driveMinutes,
        utilization: Math.round(
          (totalMinutes / (8 * 60)) * 100 // % of 8-hour day
        ),
      },
    };
  });

  // Fleet utilization
  const activeVehicles = vehicles.filter((v) => v.status === "in-field").length;
  const totalVehicles = vehicles.length;
  const idleVehicles = vehicles.filter(
    (v) => v.status === "depot" && v.assignedTo === null
  ).length;

  return NextResponse.json({
    date: new Date().toISOString().split("T")[0],
    schedule,
    fleetSummary: {
      totalVehicles,
      activeVehicles,
      idleVehicles,
      inMaintenance: vehicles.filter((v) => v.status === "maintenance").length,
      fleetUtilization: Math.round((activeVehicles / totalVehicles) * 100),
    },
    overallStats: {
      totalJobs: jobs.length,
      totalTechsWorking: schedule.filter((s) => s.stats.totalJobs > 0).length,
      avgUtilization: Math.round(
        schedule
          .filter((s) => s.stats.totalJobs > 0)
          .reduce((s, t) => s + t.stats.utilization, 0) /
          schedule.filter((s) => s.stats.totalJobs > 0).length
      ),
    },
  });
}
