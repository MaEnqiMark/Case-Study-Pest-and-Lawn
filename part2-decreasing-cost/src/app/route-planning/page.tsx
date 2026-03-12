"use client";

import { useEffect, useState } from "react";

export default function RoutePlanning() {
  const [data, setData] = useState<any>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/routes").then((r) => r.json()).then(setData);
  }, []);

  const selectedRoute = data?.routes?.find(
    (r: any) => r.technician.id === selectedTech
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">AI Route Planning</h1>
      <p className="text-gray-500 mb-6">
        Optimized routes using nearest-neighbor algorithm to minimize drive time.
      </p>

      {data && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-semibold">
            Total miles saved today: {data.totalMilesSaved} mi across {data.totalTechnicians} routes
          </p>
        </div>
      )}

      {/* Technician selector */}
      <div className="flex gap-3 mb-6">
        {data?.routes?.map((route: any) => (
          <button
            key={route.technician.id}
            onClick={() => setSelectedTech(route.technician.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedTech === route.technician.id
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {route.technician.name} ({route.optimizedJobs.length} stops)
          </button>
        ))}
      </div>

      {/* Route detail */}
      {selectedRoute && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-lg">{selectedRoute.technician.name}</h2>
              <p className="text-sm text-gray-500">Specialty: {selectedRoute.technician.specialty}</p>
            </div>
            <div className="text-right">
              <p className="text-sm">
                Original: <span className="text-red-500 font-medium">{selectedRoute.originalMiles} mi</span>
              </p>
              <p className="text-sm">
                Optimized: <span className="text-green-600 font-medium">{selectedRoute.optimizedMiles} mi</span>
              </p>
              <p className="text-sm font-semibold text-green-700">
                Saved: {selectedRoute.savedMiles} mi ({selectedRoute.savingsPercent}%)
              </p>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Stop</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Customer</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Address</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Service</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Duration</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedRoute.optimizedJobs.map((job: any) => (
                <tr key={job.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                      {job.stopNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{job.customerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{job.address}</td>
                  <td className="px-4 py-3 text-sm">{job.service}</td>
                  <td className="px-4 py-3 text-sm">{job.estimatedDuration} min</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        job.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : job.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!selectedTech && data && (
        <p className="text-gray-400 text-center py-8">Select a technician to view their optimized route.</p>
      )}
    </div>
  );
}
