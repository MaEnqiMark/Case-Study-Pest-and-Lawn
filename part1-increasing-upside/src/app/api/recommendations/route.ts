import { NextRequest, NextResponse } from "next/server";
import {
  getCustomers,
  getCustomerById,
  getServiceHistory,
  getTreatmentPlans,
  getCustomerServiceTypes,
  getCustomerLastService,
  getServices,
} from "@/lib/db";

type Recommendation = {
  customerId: string;
  customerName: string;
  type: "cross-sell" | "upsell" | "re-engage";
  priority: "high" | "medium" | "low";
  suggestedService: string;
  reason: string;
  estimatedRevenue: number;
  emailSubject: string;
  emailBody: string;
};

function generateRecommendations(customerId?: string): Recommendation[] {
  const customers = customerId
    ? [getCustomerById(customerId)].filter(Boolean)
    : getCustomers();
  const services = getServices();
  const recommendations: Recommendation[] = [];

  for (const customer of customers) {
    if (!customer) continue;

    const serviceTypes = getCustomerServiceTypes(customer.id);
    const history = getServiceHistory(customer.id);
    const plans = getTreatmentPlans(customer.id);
    const lastService = getCustomerLastService(customer.id);
    const isCommercial = customer.propertyType === "commercial";

    // CROSS-SELL: Lawn-only → suggest pest
    if (serviceTypes.includes("lawn") && !serviceTypes.includes("pest")) {
      const suggestedService = isCommercial
        ? "ProPlus Commercial Services"
        : "Four Seasons Protection Plan";
      const estimatedRevenue = isCommercial ? 350 * 12 : 120 * 4;

      recommendations.push({
        customerId: customer.id,
        customerName: customer.name,
        type: "cross-sell",
        priority: "high",
        suggestedService,
        reason: `Active lawn customer for ${plans.length} plan(s) but no pest protection. ${isCommercial ? "Commercial properties" : "Homes"} in OKC metro are especially vulnerable to seasonal pest activity.`,
        estimatedRevenue,
        emailSubject: `${customer.name.split(" ")[0]}, protect your ${isCommercial ? "property" : "home"} from pests this season`,
        emailBody: `Hi ${customer.name.split(" ")[0]},\n\nThank you for being a valued lawn care customer! We noticed your property at ${customer.address} doesn't currently have pest protection.\n\nWith Oklahoma's warm seasons, pests like ants, spiders, and roaches are especially active. Our ${suggestedService} provides year-round protection with ${isCommercial ? "monthly" : "quarterly"} treatments.\n\nAs an existing customer, we'd like to offer you 15% off your first treatment. Reply to this email or call us to schedule a free inspection.\n\nBest regards,\nYour Pest & Lawn Team`,
      });
    }

    // CROSS-SELL: Pest-only → suggest lawn
    if (serviceTypes.includes("pest") && !serviceTypes.includes("lawn")) {
      const suggestedService = isCommercial
        ? "Commercial Lawn Program"
        : "7-Step Weed Control & Fertilization";
      const estimatedRevenue = isCommercial ? 600 * 7 : 90 * 6;

      recommendations.push({
        customerId: customer.id,
        customerName: customer.name,
        type: "cross-sell",
        priority: "high",
        suggestedService,
        reason: `Active pest customer but no lawn services. Bundling lawn + pest increases retention and lifetime value. Property is ${customer.propertySizeSqFt.toLocaleString()} sq ft in ${customer.zip}.`,
        estimatedRevenue,
        emailSubject: `${customer.name.split(" ")[0]}, your lawn deserves the same care as your pest protection`,
        emailBody: `Hi ${customer.name.split(" ")[0]},\n\nYou've trusted us to keep your ${isCommercial ? "property" : "home"} pest-free, and we appreciate that! We also offer professional lawn care that pairs perfectly with your current pest plan.\n\nOur ${suggestedService} includes pre and post-emergent weed control, high-quality fertilizer, and expert care tailored to Oklahoma soil.\n\nBundle your lawn and pest services and save 10% on both. Want to schedule a free lawn analysis? Just reply to this email.\n\nBest regards,\nYour Pest & Lawn Team`,
      });
    }

    // UPSELL: One-time customers → suggest recurring plan
    if (history.length > 0 && history.every((s) => !s.recurring)) {
      const mostRecentType = lastService?.serviceType ?? "pest";
      const suggestedService =
        mostRecentType === "pest"
          ? "Four Seasons Protection Plan"
          : "7-Step Weed Control & Fertilization";
      const estimatedRevenue =
        mostRecentType === "pest" ? 120 * 4 : 90 * 6;

      recommendations.push({
        customerId: customer.id,
        customerName: customer.name,
        type: "upsell",
        priority: "high",
        suggestedService,
        reason: `Customer has only used one-time treatments (${history.length} service(s)). Converting to a recurring plan increases annual revenue from ~$${history.reduce((s, h) => s + h.amount, 0)} to ~$${estimatedRevenue}.`,
        estimatedRevenue,
        emailSubject: `${customer.name.split(" ")[0]}, save money with a protection plan`,
        emailBody: `Hi ${customer.name.split(" ")[0]},\n\nThanks for choosing us for your recent ${mostRecentType} treatment! Did you know that a recurring protection plan can save you up to 20% compared to one-time visits?\n\nOur ${suggestedService} provides consistent, scheduled care so you never have to worry about ${mostRecentType === "pest" ? "pest infestations" : "weeds and lawn health"}.\n\nWe'd love to set up a plan that fits your needs. Reply or call us for a personalized quote.\n\nBest regards,\nYour Pest & Lawn Team`,
      });
    }

    // UPSELL: Lawn customers without add-ons → suggest fungicide, soil testing, insect control
    if (
      serviceTypes.includes("lawn") &&
      !history.some((s) => s.specificService === "Fungicide Treatment") &&
      history.some((s) => s.recurring)
    ) {
      recommendations.push({
        customerId: customer.id,
        customerName: customer.name,
        type: "upsell",
        priority: "medium",
        suggestedService: "Fungicide Treatment",
        reason: `Active lawn plan customer who hasn't used fungicide. Oklahoma humidity makes lawns prone to brown patch and dollar spot, especially June-August.`,
        estimatedRevenue: 85,
        emailSubject: `${customer.name.split(" ")[0]}, protect your lawn from summer disease`,
        emailBody: `Hi ${customer.name.split(" ")[0]},\n\nOklahoma summers can be tough on lawns. Fungal diseases like brown patch thrive in our heat and humidity.\n\nA one-time fungicide treatment ($65-$120 depending on lawn size) can prevent costly damage. We can apply it during your next scheduled visit for maximum convenience.\n\nWant to add it to your next service? Just reply to this email.\n\nBest regards,\nYour Pest & Lawn Team`,
      });
    }

    // RE-ENGAGE: Last service was 90+ days ago and no active recurring plan
    if (lastService) {
      const daysSince = Math.floor(
        (Date.now() - new Date(lastService.date).getTime()) / (1000 * 60 * 60 * 24)
      );
      const hasActivePlan = plans.some((p) => p.status === "active");

      if (daysSince > 90 && !hasActivePlan) {
        recommendations.push({
          customerId: customer.id,
          customerName: customer.name,
          type: "re-engage",
          priority: "medium",
          suggestedService: lastService.specificService,
          reason: `Last service was ${daysSince} days ago (${lastService.date}). No active plan. At risk of churning.`,
          estimatedRevenue: lastService.amount * 4,
          emailSubject: `We miss you, ${customer.name.split(" ")[0]}! Time for your next treatment?`,
          emailBody: `Hi ${customer.name.split(" ")[0]},\n\nIt's been a while since your last ${lastService.serviceType} service. We want to make sure your ${customer.propertyType === "commercial" ? "property" : "home"} stays protected.\n\nSchedule your next visit this month and receive 10% off. We have availability this week!\n\nReply or call us to book.\n\nBest regards,\nYour Pest & Lawn Team`,
        });
      }
    }
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return recommendations;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const customerId = searchParams.get("customerId") ?? undefined;
  const type = searchParams.get("type"); // "cross-sell" | "upsell" | "re-engage"

  let recommendations = generateRecommendations(customerId);

  if (type) {
    recommendations = recommendations.filter((r) => r.type === type);
  }

  const summary = {
    total: recommendations.length,
    crossSell: recommendations.filter((r) => r.type === "cross-sell").length,
    upsell: recommendations.filter((r) => r.type === "upsell").length,
    reEngage: recommendations.filter((r) => r.type === "re-engage").length,
    totalEstimatedRevenue: recommendations.reduce(
      (sum, r) => sum + r.estimatedRevenue,
      0
    ),
  };

  return NextResponse.json({ summary, recommendations });
}
