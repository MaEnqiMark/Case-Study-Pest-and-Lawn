import { NextRequest, NextResponse } from "next/server";
import {
  getCustomers,
  getCustomerById,
  getServiceHistory,
  getTreatmentPlans,
  getCustomerServiceTypes,
  getCustomerLastService,
} from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  const filter = searchParams.get("filter"); // "lawn-only" | "pest-only" | "one-time"

  // Single customer with full details
  if (id) {
    const customer = getCustomerById(id);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json({
      ...customer,
      serviceTypes: getCustomerServiceTypes(id),
      serviceHistory: getServiceHistory(id),
      treatmentPlans: getTreatmentPlans(id),
      lastService: getCustomerLastService(id),
    });
  }

  // All customers with summary info
  let customers = getCustomers();

  const enriched = customers.map((c) => {
    const serviceTypes = getCustomerServiceTypes(c.id);
    const history = getServiceHistory(c.id);
    const plans = getTreatmentPlans(c.id);
    const lastService = getCustomerLastService(c.id);
    const totalSpend = history.reduce((sum, s) => sum + s.amount, 0);
    const hasRecurring = history.some((s) => s.recurring);

    return {
      ...c,
      serviceTypes,
      totalSpend,
      serviceCount: history.length,
      activePlans: plans.filter((p) => p.status === "active").length,
      hasRecurring,
      lastServiceDate: lastService?.date ?? null,
    };
  });

  // Apply filters
  if (filter === "lawn-only") {
    return NextResponse.json(
      enriched.filter(
        (c) => c.serviceTypes.includes("lawn") && !c.serviceTypes.includes("pest")
      )
    );
  }
  if (filter === "pest-only") {
    return NextResponse.json(
      enriched.filter(
        (c) => c.serviceTypes.includes("pest") && !c.serviceTypes.includes("lawn")
      )
    );
  }
  if (filter === "one-time") {
    return NextResponse.json(enriched.filter((c) => !c.hasRecurring));
  }

  return NextResponse.json(enriched);
}
