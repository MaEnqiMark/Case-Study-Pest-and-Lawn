"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [schedule, setSchedule] = useState<any>(null);
  const [inventory, setInventory] = useState<any>(null);
  const [routes, setRoutes] = useState<any>(null);

  useEffect(() => {
    fetch("/api/schedule").then((r) => r.json()).then(setSchedule);
    fetch("/api/inventory").then((r) => r.json()).then(setInventory);
    fetch("/api/routes").then((r) => r.json()).then(setRoutes);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Operations Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Today&apos;s Jobs</p>
          <p className="text-3xl font-bold">{schedule?.overallStats?.totalJobs ?? "..."}</p>
          <p className="text-sm text-gray-400">{schedule?.overallStats?.totalTechsWorking ?? 0} techs working</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Avg Utilization</p>
          <p className="text-3xl font-bold">{schedule?.overallStats?.avgUtilization ?? "..."}%</p>
          <p className="text-sm text-gray-400">of 8-hour day</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Fleet Usage</p>
          <p className="text-3xl font-bold">{schedule?.fleetSummary?.fleetUtilization ?? "..."}%</p>
          <p className="text-sm text-gray-400">{schedule?.fleetSummary?.idleVehicles ?? 0} vehicles idle</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Low Stock Alerts</p>
          <p className={`text-3xl font-bold ${(inventory?.lowStockAlerts ?? 0) > 0 ? "text-red-600" : "text-green-600"}`}>
            {inventory?.lowStockAlerts ?? "..."}
          </p>
          <p className="text-sm text-gray-400">{inventory?.totalItems ?? 0} items tracked</p>
        </div>
      </div>

      {routes && (
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <h2 className="font-semibold mb-2">Route Optimization Savings</h2>
          <p className="text-green-600 text-lg font-bold">
            {routes.totalMilesSaved} miles saved today
          </p>
          <p className="text-sm text-gray-500">
            across {routes.totalTechnicians} technician routes ({routes.totalJobs} jobs)
          </p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        <Link href="/route-planning" className="bg-blue-600 text-white rounded-lg p-4 text-center hover:bg-blue-700 transition">
          Route Planning
        </Link>
        <Link href="/scheduling" className="bg-purple-600 text-white rounded-lg p-4 text-center hover:bg-purple-700 transition">
          Scheduling
        </Link>
        <Link href="/inventory" className="bg-orange-600 text-white rounded-lg p-4 text-center hover:bg-orange-700 transition">
          Inventory
        </Link>
        <Link href="/reports" className="bg-green-600 text-white rounded-lg p-4 text-center hover:bg-green-700 transition">
          Tech Reports
        </Link>
      </div>
    </div>
  );
}
