"use client";

import { useEffect, useState } from "react";

export default function Scheduling() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/schedule").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Scheduling & Asset Optimization</h1>
      <p className="text-gray-500 mb-6">
        Technician workload and vehicle utilization for today.
      </p>

      {/* Fleet Summary */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Vehicles</p>
          <p className="text-2xl font-bold">{data.fleetSummary.totalVehicles}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Active (In Field)</p>
          <p className="text-2xl font-bold text-green-600">{data.fleetSummary.activeVehicles}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Idle at Depot</p>
          <p className="text-2xl font-bold text-yellow-600">{data.fleetSummary.idleVehicles}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">In Maintenance</p>
          <p className="text-2xl font-bold text-red-600">{data.fleetSummary.inMaintenance}</p>
        </div>
      </div>

      {/* Technician Schedules */}
      <div className="space-y-4">
        {data.schedule
          .filter((s: any) => s.stats.totalJobs > 0)
          .map((s: any) => (
            <div key={s.technician.id} className="bg-white rounded-lg shadow">
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{s.technician.name}</h3>
                  <p className="text-sm text-gray-500">
                    {s.technician.specialty} specialist
                    {s.vehicle ? ` | ${s.vehicle.year} ${s.vehicle.make} ${s.vehicle.model}` : " | No vehicle assigned"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Utilization</p>
                    <p className="text-lg font-bold">{s.stats.utilization}%</p>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        s.stats.utilization > 90
                          ? "bg-red-500"
                          : s.stats.utilization > 70
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                      style={{ width: `${Math.min(100, s.stats.utilization)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-4">
                <div className="flex gap-2 mb-3 text-xs text-gray-400">
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">
                    {s.stats.completed} done
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                    {s.stats.inProgress} active
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                    {s.stats.scheduled} upcoming
                  </span>
                  <span className="text-gray-400 ml-auto">
                    {s.stats.totalServiceMinutes} min service + {s.stats.estimatedDriveMinutes} min drive
                  </span>
                </div>

                <div className="space-y-2">
                  {s.jobs.map((job: any) => (
                    <div
                      key={job.id}
                      className={`flex items-center gap-3 p-2 rounded text-sm ${
                        job.status === "completed"
                          ? "bg-green-50"
                          : job.status === "in-progress"
                          ? "bg-yellow-50"
                          : "bg-gray-50"
                      }`}
                    >
                      <span className="font-mono text-gray-500 w-12">{job.scheduledTime}</span>
                      <span className="font-medium w-48">{job.customerName}</span>
                      <span className="text-gray-500 flex-1">{job.service}</span>
                      <span className="text-gray-400">{job.estimatedDuration} min</span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          job.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : job.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
