import { NextRequest, NextResponse } from "next/server";
import {
  generateForecast,
  getMonthlyRiskSummary,
  getRevenueProjection,
} from "@/lib/forecast";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const view = searchParams.get("view"); // "detail" | "summary" | "revenue"
  const category = searchParams.get("category") as "pest" | "lawn" | null;
  const monthParam = searchParams.get("month"); // single month (1-12)
  const monthsParam = searchParams.get("months"); // comma-separated months

  // Revenue projection view
  if (view === "revenue") {
    return NextResponse.json(getRevenueProjection());
  }

  // Monthly risk summary view
  if (view === "summary") {
    return NextResponse.json(getMonthlyRiskSummary());
  }

  // Detailed forecast (default)
  let months: number[] | undefined;
  if (monthParam) {
    months = [parseInt(monthParam)];
  } else if (monthsParam) {
    months = monthsParam.split(",").map(Number);
  }

  const forecast = generateForecast(
    months,
    category ?? undefined
  );

  // Group by month for easier consumption
  const grouped: Record<
    string,
    { month: number; monthName: string; entries: typeof forecast }
  > = {};

  for (const entry of forecast) {
    const key = entry.monthName;
    if (!grouped[key]) {
      grouped[key] = { month: entry.month, monthName: key, entries: [] };
    }
    grouped[key].entries.push(entry);
  }

  // Sort entries within each month by score descending
  for (const group of Object.values(grouped)) {
    group.entries.sort((a, b) => b.activityScore - a.activityScore);
  }

  return NextResponse.json({
    totalEntries: forecast.length,
    months: Object.values(grouped).sort((a, b) => a.month - b.month),
  });
}
