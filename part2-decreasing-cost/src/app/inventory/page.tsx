"use client";

import { useEffect, useState } from "react";

export default function Inventory() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/inventory").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Inventory Management</h1>
      <p className="text-gray-500 mb-6">
        Track chemical and supply inventory across warehouse and vehicles.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Inventory Value</p>
          <p className="text-2xl font-bold">${data.totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Items Tracked</p>
          <p className="text-2xl font-bold">{data.totalItems}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Low Stock Alerts</p>
          <p className={`text-2xl font-bold ${data.lowStockAlerts > 0 ? "text-red-600" : "text-green-600"}`}>
            {data.lowStockAlerts}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {data.byCategory.map((cat: any) => (
          <div key={cat.category} className="bg-white rounded-lg shadow p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{cat.category}</p>
            <p className="font-semibold">{cat.itemCount} items</p>
            <p className="text-sm text-gray-500">${cat.totalValue.toLocaleString()}</p>
            {cat.lowStockItems > 0 && (
              <p className="text-xs text-red-500 mt-1">{cat.lowStockItems} low stock</p>
            )}
          </div>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Item</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">In Stock</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Min Threshold</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Unit Cost</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Value</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Last Restocked</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item: any) => (
              <tr key={item.id} className={`border-t ${item.stockStatus === "low" ? "bg-red-50" : ""}`}>
                <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{item.category}</td>
                <td className="px-4 py-3 text-sm font-medium">
                  {item.inStock} {item.unit}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{item.minThreshold}</td>
                <td className="px-4 py-3 text-sm">${item.costPerUnit}</td>
                <td className="px-4 py-3 text-sm">${item.value.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      item.stockStatus === "low"
                        ? "bg-red-100 text-red-800"
                        : item.stockStatus === "warning"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.stockStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{item.lastRestocked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
