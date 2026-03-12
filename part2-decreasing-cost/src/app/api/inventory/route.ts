import { NextRequest, NextResponse } from "next/server";
import { getInventory, getLowStockItems } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filter = searchParams.get("filter"); // "low-stock" | "category"
  const category = searchParams.get("category");

  const inventory = getInventory();

  if (filter === "low-stock") {
    const lowStock = getLowStockItems();
    return NextResponse.json({
      alertCount: lowStock.length,
      items: lowStock.map((item) => ({
        ...item,
        deficit: item.minThreshold - item.inStock,
        reorderCost: (item.minThreshold - item.inStock + 5) * item.costPerUnit,
      })),
    });
  }

  if (category) {
    return NextResponse.json(
      inventory.filter((i) => i.category === category)
    );
  }

  // Full inventory with status indicators
  const totalValue = inventory.reduce(
    (s, i) => s + i.inStock * i.costPerUnit,
    0
  );
  const lowStockCount = getLowStockItems().length;

  const categories = [...new Set(inventory.map((i) => i.category))];
  const byCategory = categories.map((cat) => {
    const items = inventory.filter((i) => i.category === cat);
    return {
      category: cat,
      itemCount: items.length,
      totalValue: items.reduce((s, i) => s + i.inStock * i.costPerUnit, 0),
      lowStockItems: items.filter((i) => i.inStock <= i.minThreshold).length,
    };
  });

  return NextResponse.json({
    totalItems: inventory.length,
    totalValue,
    lowStockAlerts: lowStockCount,
    byCategory,
    items: inventory.map((item) => ({
      ...item,
      value: item.inStock * item.costPerUnit,
      stockStatus:
        item.inStock <= item.minThreshold
          ? "low"
          : item.inStock <= item.minThreshold * 1.5
          ? "warning"
          : "good",
    })),
  });
}
