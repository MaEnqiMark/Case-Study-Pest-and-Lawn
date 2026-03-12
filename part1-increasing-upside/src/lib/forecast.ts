import { getServiceHistory, getCustomers } from "./db";

// ──────────────────────────────────────────────
// Oklahoma City weather averages (monthly)
// Source: NOAA normals for OKC Will Rogers Airport
// ──────────────────────────────────────────────
const OKC_WEATHER: Record<
  number,
  { avgTempF: number; avgHumidity: number; avgRainfallIn: number }
> = {
  1: { avgTempF: 37, avgHumidity: 62, avgRainfallIn: 1.3 },
  2: { avgTempF: 42, avgHumidity: 60, avgRainfallIn: 1.5 },
  3: { avgTempF: 52, avgHumidity: 58, avgRainfallIn: 2.7 },
  4: { avgTempF: 62, avgHumidity: 60, avgRainfallIn: 3.5 },
  5: { avgTempF: 71, avgHumidity: 66, avgRainfallIn: 5.2 },
  6: { avgTempF: 80, avgHumidity: 64, avgRainfallIn: 4.4 },
  7: { avgTempF: 85, avgHumidity: 58, avgRainfallIn: 2.8 },
  8: { avgTempF: 84, avgHumidity: 58, avgRainfallIn: 2.9 },
  9: { avgTempF: 75, avgHumidity: 62, avgRainfallIn: 3.8 },
  10: { avgTempF: 63, avgHumidity: 60, avgRainfallIn: 3.4 },
  11: { avgTempF: 50, avgHumidity: 62, avgRainfallIn: 2.3 },
  12: { avgTempF: 39, avgHumidity: 63, avgRainfallIn: 1.7 },
};

// ──────────────────────────────────────────────
// Pest activity thresholds (based on entomology research)
// ──────────────────────────────────────────────
const PEST_PROFILES: {
  name: string;
  category: string;
  tempMin: number;
  tempPeak: number;
  tempMax: number;
  humidityBoost: number; // humidity threshold above which activity increases
  rainfallEffect: "positive" | "negative" | "neutral";
  peakMonths: number[];
  riskWeight: number; // base importance (1-10)
}[] = [
  {
    name: "Fire Ants",
    category: "pest",
    tempMin: 55,
    tempPeak: 80,
    tempMax: 95,
    humidityBoost: 60,
    rainfallEffect: "positive",
    peakMonths: [4, 5, 6, 7, 8, 9, 10],
    riskWeight: 8,
  },
  {
    name: "Cockroaches",
    category: "pest",
    tempMin: 50,
    tempPeak: 85,
    tempMax: 100,
    humidityBoost: 65,
    rainfallEffect: "positive",
    peakMonths: [5, 6, 7, 8, 9],
    riskWeight: 7,
  },
  {
    name: "Spiders (Brown Recluse)",
    category: "pest",
    tempMin: 45,
    tempPeak: 78,
    tempMax: 95,
    humidityBoost: 55,
    rainfallEffect: "neutral",
    peakMonths: [3, 4, 5, 6, 7, 8, 9, 10],
    riskWeight: 6,
  },
  {
    name: "Termites (Subterranean)",
    category: "termite",
    tempMin: 50,
    tempPeak: 75,
    tempMax: 90,
    humidityBoost: 60,
    rainfallEffect: "positive",
    peakMonths: [3, 4, 5, 6],
    riskWeight: 10,
  },
  {
    name: "Mosquitoes",
    category: "pest",
    tempMin: 50,
    tempPeak: 82,
    tempMax: 95,
    humidityBoost: 65,
    rainfallEffect: "positive",
    peakMonths: [5, 6, 7, 8, 9],
    riskWeight: 5,
  },
  {
    name: "Ticks",
    category: "pest",
    tempMin: 45,
    tempPeak: 72,
    tempMax: 90,
    humidityBoost: 60,
    rainfallEffect: "positive",
    peakMonths: [4, 5, 6, 7, 8],
    riskWeight: 6,
  },
  {
    name: "Wasps/Hornets",
    category: "pest",
    tempMin: 55,
    tempPeak: 80,
    tempMax: 95,
    humidityBoost: 50,
    rainfallEffect: "negative",
    peakMonths: [5, 6, 7, 8, 9],
    riskWeight: 5,
  },
  {
    name: "Rodents",
    category: "pest",
    tempMin: 20,
    tempPeak: 40,
    tempMax: 60,
    humidityBoost: 70,
    rainfallEffect: "positive",
    peakMonths: [10, 11, 12, 1, 2],
    riskWeight: 7,
  },
];

// ──────────────────────────────────────────────
// Lawn disease/weed profiles
// ──────────────────────────────────────────────
const LAWN_PROFILES: {
  name: string;
  tempMin: number;
  tempPeak: number;
  tempMax: number;
  humidityBoost: number;
  rainfallEffect: "positive" | "negative" | "neutral";
  peakMonths: number[];
  riskWeight: number;
}[] = [
  {
    name: "Crabgrass Germination",
    tempMin: 55,
    tempPeak: 70,
    tempMax: 85,
    humidityBoost: 55,
    rainfallEffect: "positive",
    peakMonths: [3, 4, 5],
    riskWeight: 8,
  },
  {
    name: "Brown Patch (Fungus)",
    tempMin: 70,
    tempPeak: 85,
    tempMax: 95,
    humidityBoost: 70,
    rainfallEffect: "positive",
    peakMonths: [6, 7, 8],
    riskWeight: 9,
  },
  {
    name: "Dollar Spot (Fungus)",
    tempMin: 60,
    tempPeak: 78,
    tempMax: 90,
    humidityBoost: 65,
    rainfallEffect: "positive",
    peakMonths: [5, 6, 7, 8, 9],
    riskWeight: 7,
  },
  {
    name: "Grub Damage",
    tempMin: 60,
    tempPeak: 75,
    tempMax: 85,
    humidityBoost: 55,
    rainfallEffect: "positive",
    peakMonths: [7, 8, 9, 10],
    riskWeight: 8,
  },
  {
    name: "Winter Weeds (Henbit/Chickweed)",
    tempMin: 35,
    tempPeak: 50,
    tempMax: 65,
    humidityBoost: 55,
    rainfallEffect: "positive",
    peakMonths: [10, 11, 12, 1, 2],
    riskWeight: 6,
  },
  {
    name: "Dandelion Surge",
    tempMin: 50,
    tempPeak: 65,
    tempMax: 80,
    humidityBoost: 50,
    rainfallEffect: "neutral",
    peakMonths: [3, 4, 5, 9, 10],
    riskWeight: 5,
  },
];

// ──────────────────────────────────────────────
// Scoring algorithm
// ──────────────────────────────────────────────
function computeActivityScore(
  profile: {
    tempMin: number;
    tempPeak: number;
    tempMax: number;
    humidityBoost: number;
    rainfallEffect: "positive" | "negative" | "neutral";
    peakMonths: number[];
    riskWeight: number;
  },
  weather: { avgTempF: number; avgHumidity: number; avgRainfallIn: number },
  month: number
): number {
  let score = 0;

  // Temperature factor (0-40 points): bell curve around peak temp
  const temp = weather.avgTempF;
  if (temp >= profile.tempMin && temp <= profile.tempMax) {
    const distFromPeak = Math.abs(temp - profile.tempPeak);
    const range = Math.max(
      profile.tempPeak - profile.tempMin,
      profile.tempMax - profile.tempPeak
    );
    const tempScore = Math.max(0, 1 - distFromPeak / range);
    score += tempScore * 40;
  }

  // Humidity factor (0-20 points)
  if (weather.avgHumidity >= profile.humidityBoost) {
    const excess = weather.avgHumidity - profile.humidityBoost;
    score += Math.min(20, excess * 1.5);
  }

  // Rainfall factor (0-15 points)
  if (profile.rainfallEffect === "positive") {
    score += Math.min(15, weather.avgRainfallIn * 3);
  } else if (profile.rainfallEffect === "negative") {
    score += Math.max(0, 15 - weather.avgRainfallIn * 3);
  } else {
    score += 7; // neutral baseline
  }

  // Seasonal peak bonus (0-15 points)
  if (profile.peakMonths.includes(month)) {
    score += 15;
  }

  // Historical demand multiplier from service data
  const history = getServiceHistory();
  const monthServices = history.filter(
    (s) => new Date(s.date).getMonth() + 1 === month
  );
  const totalServices = history.length;
  const monthShare = totalServices > 0 ? monthServices.length / totalServices : 1 / 12;
  const historicalMultiplier = monthShare / (1 / 12); // >1 means above average
  score *= Math.max(0.5, Math.min(1.5, historicalMultiplier));

  // Apply risk weight
  score = (score / 100) * profile.riskWeight * 10;

  return Math.round(Math.min(100, Math.max(0, score)));
}

// ──────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────

export type ForecastEntry = {
  name: string;
  category: "pest" | "lawn";
  month: number;
  monthName: string;
  activityScore: number; // 0-100
  riskLevel: "low" | "moderate" | "high" | "critical";
  weather: { avgTempF: number; avgHumidity: number; avgRainfallIn: number };
  recommendation: string;
};

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getRiskLevel(score: number): "low" | "moderate" | "high" | "critical" {
  if (score >= 75) return "critical";
  if (score >= 50) return "high";
  if (score >= 25) return "moderate";
  return "low";
}

function getRecommendation(
  name: string,
  riskLevel: string,
  category: string
): string {
  if (riskLevel === "critical") {
    return category === "pest"
      ? `Critical ${name} activity expected. Proactively contact unprotected customers. Increase technician allocation. Run targeted ad campaign in affected zip codes.`
      : `Critical ${name} risk. Send preventive treatment reminders to all lawn customers. Stock extra fungicide/herbicide. Offer add-on treatments during scheduled visits.`;
  }
  if (riskLevel === "high") {
    return category === "pest"
      ? `High ${name} activity likely. Email existing customers about protection plans. Ensure adequate chemical inventory.`
      : `High ${name} risk. Recommend add-on treatments to customers on scheduled visits. Follow up with one-time customers from last season.`;
  }
  if (riskLevel === "moderate") {
    return category === "pest"
      ? `Moderate ${name} activity. Standard monitoring. Good time for cross-sell emails to lawn-only customers.`
      : `Moderate ${name} risk. Include in routine lawn analysis. Mention during customer check-ins.`;
  }
  return `Low ${name} activity. Focus resources elsewhere. Maintain baseline monitoring.`;
}

export function generateForecast(
  months?: number[],
  category?: "pest" | "lawn"
): ForecastEntry[] {
  const targetMonths = months ?? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const results: ForecastEntry[] = [];

  for (const month of targetMonths) {
    const weather = OKC_WEATHER[month];

    // Pest forecasts
    if (!category || category === "pest") {
      for (const pest of PEST_PROFILES) {
        const score = computeActivityScore(pest, weather, month);
        const riskLevel = getRiskLevel(score);
        results.push({
          name: pest.name,
          category: "pest",
          month,
          monthName: MONTH_NAMES[month],
          activityScore: score,
          riskLevel,
          weather,
          recommendation: getRecommendation(pest.name, riskLevel, "pest"),
        });
      }
    }

    // Lawn forecasts
    if (!category || category === "lawn") {
      for (const lawn of LAWN_PROFILES) {
        const score = computeActivityScore(lawn, weather, month);
        const riskLevel = getRiskLevel(score);
        results.push({
          name: lawn.name,
          category: "lawn",
          month,
          monthName: MONTH_NAMES[month],
          activityScore: score,
          riskLevel,
          weather,
          recommendation: getRecommendation(lawn.name, riskLevel, "lawn"),
        });
      }
    }
  }

  return results;
}

export function getMonthlyRiskSummary() {
  const forecast = generateForecast();
  const summary: {
    month: number;
    monthName: string;
    pestScore: number;
    lawnScore: number;
    overallScore: number;
    topThreats: string[];
    weather: { avgTempF: number; avgHumidity: number; avgRainfallIn: number };
  }[] = [];

  for (let m = 1; m <= 12; m++) {
    const monthData = forecast.filter((f) => f.month === m);
    const pestEntries = monthData.filter((f) => f.category === "pest");
    const lawnEntries = monthData.filter((f) => f.category === "lawn");

    const pestScore = Math.round(
      pestEntries.reduce((s, e) => s + e.activityScore, 0) / pestEntries.length
    );
    const lawnScore = Math.round(
      lawnEntries.reduce((s, e) => s + e.activityScore, 0) / lawnEntries.length
    );

    const topThreats = monthData
      .sort((a, b) => b.activityScore - a.activityScore)
      .slice(0, 3)
      .map((t) => `${t.name} (${t.activityScore})`);

    summary.push({
      month: m,
      monthName: MONTH_NAMES[m],
      pestScore,
      lawnScore,
      overallScore: Math.round((pestScore + lawnScore) / 2),
      topThreats,
      weather: OKC_WEATHER[m],
    });
  }

  return summary;
}

export function getRevenueProjection() {
  const history = getServiceHistory();
  const customers = getCustomers();
  const forecast = generateForecast();

  // Calculate historical monthly revenue
  const monthlyRevenue: Record<number, number> = {};
  for (const s of history) {
    const month = new Date(s.date).getMonth() + 1;
    monthlyRevenue[month] = (monthlyRevenue[month] ?? 0) + s.amount;
  }

  // Project revenue with forecast multiplier
  // Higher activity = more demand = more revenue potential
  const projections: {
    month: number;
    monthName: string;
    historicalRevenue: number;
    projectedRevenue: number;
    upliftFromCrossSell: number;
    totalProjected: number;
  }[] = [];

  // Count cross-sell opportunities
  const lawnOnly = customers.filter((c) => {
    const types = [
      ...new Set(history.filter((s) => s.customerId === c.id).map((s) => s.serviceType)),
    ];
    return types.includes("lawn") && !types.includes("pest");
  });
  const pestOnly = customers.filter((c) => {
    const types = [
      ...new Set(history.filter((s) => s.customerId === c.id).map((s) => s.serviceType)),
    ];
    return types.includes("pest") && !types.includes("lawn");
  });

  // Assume 15% cross-sell conversion rate (conservative)
  const crossSellConversions = Math.round(
    (lawnOnly.length + pestOnly.length) * 0.15
  );
  const avgCrossSellValue = 120; // avg quarterly pest or bimonthly lawn visit
  const annualCrossSellUplift = crossSellConversions * avgCrossSellValue * 4;

  for (let m = 1; m <= 12; m++) {
    const historical = monthlyRevenue[m] ?? 0;
    const monthForecast = forecast.filter((f) => f.month === m);
    const avgScore =
      monthForecast.reduce((s, f) => s + f.activityScore, 0) /
      monthForecast.length;

    // Higher activity months get a boost from proactive outreach
    const activityMultiplier = 1 + (avgScore / 100) * 0.15; // up to 15% uplift
    const projected = Math.round(historical * activityMultiplier);
    const monthlyCrossSell = Math.round(annualCrossSellUplift / 12);

    projections.push({
      month: m,
      monthName: MONTH_NAMES[m],
      historicalRevenue: historical,
      projectedRevenue: projected,
      upliftFromCrossSell: monthlyCrossSell,
      totalProjected: projected + monthlyCrossSell,
    });
  }

  return {
    annualHistorical: Object.values(monthlyRevenue).reduce((s, v) => s + v, 0),
    annualProjected: projections.reduce((s, p) => s + p.totalProjected, 0),
    crossSellOpportunities: lawnOnly.length + pestOnly.length,
    estimatedConversions: crossSellConversions,
    annualCrossSellUplift,
    monthly: projections,
  };
}
