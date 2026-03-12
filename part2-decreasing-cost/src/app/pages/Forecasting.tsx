import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Bug,
  Leaf,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  RefreshCw,
  Thermometer,
  Droplets,
  CloudRain,
  Sprout,
  AlertTriangle,
  ArrowUp,
  MapPin,
  Map,
  CheckCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { LivePestRiskMap } from "../components/LivePestRiskMap";

interface PestThreat {
  name: string;
  threat: number;
  level: "LOW" | "LOW-MOD" | "MODERATE" | "HIGH" | "CRITICAL";
  peak: string;
  areas: string[];
  trend: "rising" | "stable" | "falling";
}

interface LawnIssue {
  name: string;
  risk: number;
  window: string;
  action: string;
}

interface RevenueOpportunity {
  opportunity: string;
  customers: number;
  revenue: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

const pestThreats: PestThreat[] = [
  {
    name: "Fire Ants",
    threat: 85,
    level: "HIGH",
    peak: "April 15",
    areas: ["South Norman", "Moore"],
    trend: "rising",
  },
  {
    name: "Mosquitoes",
    threat: 72,
    level: "HIGH",
    peak: "May 1",
    areas: ["Lake Thunderbird", "Riverside"],
    trend: "rising",
  },
  {
    name: "Termites (Subterranean)",
    threat: 68,
    level: "MODERATE",
    peak: "March 25",
    areas: ["Older Neighborhoods", "Downtown"],
    trend: "stable",
  },
  {
    name: "Brown Recluse Spiders",
    threat: 45,
    level: "MODERATE",
    peak: "May 15",
    areas: ["Residential", "Storage Units"],
    trend: "rising",
  },
  {
    name: "German Cockroaches",
    threat: 38,
    level: "LOW-MOD",
    peak: "June 1",
    areas: ["Apartments", "Commercial"],
    trend: "stable",
  },
  {
    name: "Ticks",
    threat: 55,
    level: "MODERATE",
    peak: "April 20",
    areas: ["Rural Norman", "Parks"],
    trend: "rising",
  },
];

const lawnIssues: LawnIssue[] = [
  {
    name: "Crabgrass Emergence",
    risk: 78,
    window: "March 15-April 10",
    action: "Pre-emergent application needed within 2 weeks",
  },
  {
    name: "Fungal Disease (Brown Patch)",
    risk: 62,
    window: "May-June",
    action: "Monitor humidity; fungicide may be needed",
  },
  {
    name: "Grub Damage",
    risk: 45,
    window: "August-September",
    action: "Schedule preventive grub treatment for July",
  },
  {
    name: "Soil Nutrient Deficiency",
    risk: 55,
    window: "Now",
    action: "Spring soil testing recommended for all accounts",
  },
];

const revenueOpportunities: RevenueOpportunity[] = [
  {
    opportunity: "Spring Termite Inspections",
    customers: 142,
    revenue: 21300,
    priority: "HIGH",
  },
  {
    opportunity: "Mosquito Season Packages",
    customers: 89,
    revenue: 11125,
    priority: "HIGH",
  },
  {
    opportunity: "Pre-Emergent Lawn Treatment",
    customers: 67,
    revenue: 8040,
    priority: "MEDIUM",
  },
  {
    opportunity: "Soil Testing Upsell",
    customers: 45,
    revenue: 3825,
    priority: "MEDIUM",
  },
];

// Weather data locations — Norman area counties/regions
const WEATHER_LOCATIONS = [
  { name: "Norman", lat: 35.2226, lng: -97.4395 },
  { name: "Moore", lat: 35.3395, lng: -97.4867 },
  { name: "OKC South", lat: 35.4676, lng: -97.5164 },
  { name: "Noble", lat: 35.1392, lng: -97.3917 },
];

interface WeatherData {
  temperature: number; // °F
  humidity: number; // %
  precipitation: number; // inches last 7 days
  windSpeed: number; // mph
  soilMoisture: string; // derived label
  summary: string;
  locations: Array<{
    name: string;
    temp: number;
    humidity: number;
    precip: number;
  }>;
}

async function fetchWeatherData(): Promise<WeatherData> {
  try {
    // Fetch current weather for all locations from Open-Meteo (free, no key)
    const results = await Promise.all(
      WEATHER_LOCATIONS.map(async (loc) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lng}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=precipitation_sum&past_days=7&forecast_days=1&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`;
        const res = await fetch(url);
        const data = await res.json();
        const precip7d = (data.daily?.precipitation_sum || []).reduce(
          (s: number, v: number) => s + (v || 0),
          0
        );
        return {
          name: loc.name,
          temp: Math.round(data.current?.temperature_2m ?? 0),
          humidity: Math.round(data.current?.relative_humidity_2m ?? 0),
          precip: Math.round(precip7d * 100) / 100,
          wind: Math.round(data.current?.wind_speed_10m ?? 0),
        };
      })
    );

    const avgTemp = Math.round(
      results.reduce((s, r) => s + r.temp, 0) / results.length
    );
    const avgHumidity = Math.round(
      results.reduce((s, r) => s + r.humidity, 0) / results.length
    );
    const totalPrecip =
      Math.round(
        (results.reduce((s, r) => s + r.precip, 0) / results.length) * 100
      ) / 100;
    const avgWind = Math.round(
      results.reduce((s, r) => s + r.wind, 0) / results.length
    );

    let soilMoisture = "Low";
    if (totalPrecip > 2) soilMoisture = "High";
    else if (totalPrecip > 1) soilMoisture = "Medium-High";
    else if (totalPrecip > 0.5) soilMoisture = "Medium";

    // Generate summary from real conditions
    const conditions: string[] = [];
    if (avgTemp > 75) conditions.push("warm temperatures promoting pest activity");
    else if (avgTemp > 60) conditions.push("moderate temperatures — seasonal pest emergence expected");
    else conditions.push("cooler temperatures keeping pest activity low");

    if (avgHumidity > 65) conditions.push("elevated humidity favoring mosquito breeding");
    if (totalPrecip > 1.5) conditions.push("recent rainfall increasing standing water risk");

    const summary =
      conditions.length > 0
        ? `Current conditions: ${conditions.join("; ")}.`
        : "Conditions within normal seasonal range.";

    return {
      temperature: avgTemp,
      humidity: avgHumidity,
      precipitation: totalPrecip,
      windSpeed: avgWind,
      soilMoisture,
      summary,
      locations: results.map((r) => ({
        name: r.name,
        temp: r.temp,
        humidity: r.humidity,
        precip: r.precip,
      })),
    };
  } catch {
    // Fallback if API is down
    return {
      temperature: 72,
      humidity: 58,
      precipitation: 1.2,
      windSpeed: 8,
      soilMoisture: "Medium",
      summary: "Weather data temporarily unavailable — using seasonal estimates.",
      locations: WEATHER_LOCATIONS.map((l) => ({
        name: l.name,
        temp: 72,
        humidity: 58,
        precip: 1.2,
      })),
    };
  }
}

// ── Historical forecast vs actual data (last 12 months) ───────────────
interface MonthlyAccuracy {
  month: string;
  forecast: number; // predicted service calls
  actual: number;   // actual service calls
  accuracy: number; // % accuracy
}

const historicalAccuracy: MonthlyAccuracy[] = [
  { month: "Apr '25", forecast: 312, actual: 298, accuracy: 91 },
  { month: "May '25", forecast: 387, actual: 410, accuracy: 89 },
  { month: "Jun '25", forecast: 445, actual: 462, accuracy: 92 },
  { month: "Jul '25", forecast: 498, actual: 521, accuracy: 88 },
  { month: "Aug '25", forecast: 476, actual: 489, accuracy: 91 },
  { month: "Sep '25", forecast: 398, actual: 378, accuracy: 87 },
  { month: "Oct '25", forecast: 310, actual: 295, accuracy: 85 },
  { month: "Nov '25", forecast: 198, actual: 182, accuracy: 82 },
  { month: "Dec '25", forecast: 145, actual: 138, accuracy: 90 },
  { month: "Jan '26", forecast: 132, actual: 125, accuracy: 89 },
  { month: "Feb '26", forecast: 168, actual: 174, accuracy: 88 },
  { month: "Mar '26", forecast: 245, actual: 258, accuracy: 87 },
];

// Per-pest-type monthly breakdown
interface PestMonthly {
  month: string;
  fireAnts: number;
  mosquitoes: number;
  termites: number;
  spiders: number;
  ticks: number;
  roaches: number;
}

const pestBreakdown: PestMonthly[] = [
  { month: "Apr '25", fireAnts: 82, mosquitoes: 45, termites: 68, spiders: 38, ticks: 42, roaches: 23 },
  { month: "May '25", fireAnts: 95, mosquitoes: 78, termites: 82, spiders: 55, ticks: 62, roaches: 38 },
  { month: "Jun '25", fireAnts: 110, mosquitoes: 120, termites: 75, spiders: 62, ticks: 58, roaches: 37 },
  { month: "Jul '25", fireAnts: 125, mosquitoes: 148, termites: 68, spiders: 72, ticks: 65, roaches: 43 },
  { month: "Aug '25", fireAnts: 118, mosquitoes: 135, termites: 72, spiders: 68, ticks: 55, roaches: 41 },
  { month: "Sep '25", fireAnts: 88, mosquitoes: 92, termites: 65, spiders: 52, ticks: 48, roaches: 33 },
  { month: "Oct '25", fireAnts: 62, mosquitoes: 48, termites: 58, spiders: 45, ticks: 52, roaches: 30 },
  { month: "Nov '25", fireAnts: 35, mosquitoes: 15, termites: 52, spiders: 38, ticks: 25, roaches: 17 },
  { month: "Dec '25", fireAnts: 18, mosquitoes: 5, termites: 45, spiders: 32, ticks: 18, roaches: 20 },
  { month: "Jan '26", fireAnts: 15, mosquitoes: 3, termites: 42, spiders: 28, ticks: 15, roaches: 22 },
  { month: "Feb '26", fireAnts: 28, mosquitoes: 8, termites: 48, spiders: 35, ticks: 25, roaches: 30 },
  { month: "Mar '26", fireAnts: 55, mosquitoes: 32, termites: 58, spiders: 42, ticks: 38, roaches: 33 },
];

const overallAccuracy = Math.round(
  historicalAccuracy.reduce((s, m) => s + m.accuracy, 0) / historicalAccuracy.length
);

export function Forecasting() {
  const [dateRange, setDateRange] = useState("30");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData().then((data) => {
      setWeather(data);
      setWeatherLoading(false);
    });
  }, []);

  const getThreatColor = (level: PestThreat["level"]) => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-500";
      case "HIGH":
        return "bg-orange-500";
      case "MODERATE":
        return "bg-yellow-500";
      case "LOW-MOD":
        return "bg-yellow-400";
      case "LOW":
        return "bg-green-500";
    }
  };

  const getThreatBadgeColor = (level: PestThreat["level"]) => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-50 text-red-700 border-red-200";
      case "HIGH":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "MODERATE":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "LOW-MOD":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "LOW":
        return "bg-green-50 text-green-700 border-green-200";
    }
  };

  const getPriorityColor = (priority: RevenueOpportunity["priority"]) => {
    switch (priority) {
      case "HIGH":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "MEDIUM":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "LOW":
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const TrendIcon = ({ trend }: { trend: PestThreat["trend"] }) => {
    if (trend === "rising")
      return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (trend === "falling")
      return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-6 bg-gray-50 min-h-screen">
      {/* Top Bar */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-1">
            Pest & Lawn Outbreak Forecast
          </h1>
          <p className="text-muted-foreground">
            AI-powered predictions for Norman, OK metro area
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Next 7 Days</SelectItem>
              <SelectItem value="14">Next 14 Days</SelectItem>
              <SelectItem value="30">Next 30 Days</SelectItem>
              <SelectItem value="60">Next 60 Days</SelectItem>
              <SelectItem value="90">Next 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 bg-white">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="gap-2 bg-[#16a34a] hover:bg-[#15803d]">
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Weather & Conditions Banner — Live from Open-Meteo API */}
      <Card className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] border-0 text-white">
        <div className="p-6">
          {weatherLoading ? (
            <div className="flex items-center gap-3 text-white/80">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Fetching live weather data for Norman, OK metro...</span>
            </div>
          ) : weather ? (
            <>
              <div className="grid grid-cols-4 gap-6 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Temperature</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-semibold">{weather.temperature}°F</span>
                      {weather.temperature > 75 && <ArrowUp className="w-4 h-4 text-orange-300" />}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Humidity</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-semibold">{weather.humidity}%</span>
                      {weather.humidity > 65 && <AlertTriangle className="w-4 h-4 text-orange-300" />}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <CloudRain className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Rainfall (last 7 days)</p>
                    <span className="text-2xl font-semibold">{weather.precipitation} in</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Soil Moisture</p>
                    <span className="text-2xl font-semibold">{weather.soilMoisture}</span>
                  </div>
                </div>
              </div>

              {/* Per-region weather breakdown */}
              <div className="grid grid-cols-4 gap-4 mb-4 pt-4 border-t border-white/20">
                {weather.locations.map((loc) => (
                  <div key={loc.name} className="bg-white/10 rounded-lg px-3 py-2">
                    <p className="text-white/70 text-xs font-medium">{loc.name}</p>
                    <p className="text-sm font-semibold">
                      {loc.temp}°F · {loc.humidity}% · {loc.precip}" rain
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/20">
                <p className="text-white/90 text-sm">
                  <strong>{weather.summary}</strong>
                </p>
              </div>
            </>
          ) : null}
        </div>
      </Card>

      {/* Regional Pest Risk Map */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Map className="w-5 h-5 text-[#16a34a]" />
          <h2 className="text-xl font-semibold">Regional Pest Risk Map</h2>
        </div>
        <LivePestRiskMap />
      </div>

      {/* Pest Threat Forecast */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bug className="w-5 h-5 text-[#16a34a]" />
          <h2 className="text-xl font-semibold">Pest Threat Forecast</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {pestThreats.map((pest) => (
            <Card
              key={pest.name}
              className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{pest.name}</h3>
                    <Badge
                      variant="outline"
                      className={`${getThreatBadgeColor(pest.level)} font-semibold`}
                    >
                      {pest.level}
                    </Badge>
                  </div>
                  <TrendIcon trend={pest.trend} />
                </div>

                <div className="space-y-3">
                  {/* Threat Level Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">
                        Threat Level
                      </span>
                      <span className="text-sm font-semibold">
                        {pest.threat}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getThreatColor(pest.level)} rounded-full transition-all`}
                        style={{ width: `${pest.threat}%` }}
                      />
                    </div>
                  </div>

                  {/* Predicted Peak */}
                  <div>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      Predicted Peak
                    </span>
                    <p className="text-sm font-medium mt-0.5">{pest.peak}</p>
                  </div>

                  {/* Affected Areas */}
                  <div>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1 block">
                      Affected Areas
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {pest.areas.map((area) => (
                        <Badge
                          key={area}
                          variant="outline"
                          className="bg-gray-50 text-gray-700 border-gray-200 text-xs"
                        >
                          <MapPin className="w-3 h-3 mr-1" />
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Lawn Health Forecast */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-5 h-5 text-[#16a34a]" />
          <h2 className="text-xl font-semibold">Lawn Health Forecast</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {lawnIssues.map((issue) => (
            <Card
              key={issue.name}
              className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <h3 className="font-semibold mb-3">{issue.name}</h3>

                {/* Risk Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Risk</span>
                    <span className="text-sm font-semibold">{issue.risk}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        issue.risk >= 70
                          ? "bg-orange-500"
                          : issue.risk >= 50
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${issue.risk}%` }}
                    />
                  </div>
                </div>

                {/* Window */}
                <div className="mb-3">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Window
                  </span>
                  <p className="text-sm font-medium mt-0.5">{issue.window}</p>
                </div>

                {/* Action */}
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Recommended Action
                  </span>
                  <p className="text-sm mt-1 text-gray-700">{issue.action}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Revenue Opportunity Alerts */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-[#16a34a]" />
          <h2 className="text-xl font-semibold">Revenue Opportunity Alerts</h2>
        </div>
        <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold">Opportunity</TableHead>
                <TableHead className="font-semibold">
                  Affected Customers
                </TableHead>
                <TableHead className="font-semibold">Est. Revenue</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
                <TableHead className="font-semibold text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueOpportunities.map((opp, index) => (
                <TableRow
                  key={opp.opportunity}
                  className={index % 2 === 1 ? "bg-gray-50" : "bg-white"}
                >
                  <TableCell className="font-medium">
                    {opp.opportunity}
                  </TableCell>
                  <TableCell>
                    {opp.customers} customers{" "}
                    {opp.opportunity.includes("Termite") && "due"}
                    {opp.opportunity.includes("Mosquito") && "in affected zones"}
                    {opp.opportunity.includes("Pre-Emergent") && ""}
                    {opp.opportunity.includes("Soil") && "no test in 2yr"}
                  </TableCell>
                  <TableCell className="font-semibold text-[#16a34a]">
                    ${opp.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getPriorityColor(opp.priority)} font-semibold`}
                    >
                      {opp.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="bg-[#16a34a] hover:bg-[#15803d]"
                    >
                      Send Campaign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Historical Accuracy */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-[#16a34a]" />
          <h2 className="text-xl font-semibold">Historical Forecast Accuracy</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Forecast vs Actual — Area Chart */}
          <Card className="lg:col-span-2 bg-white border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold">Predicted vs Actual Service Calls</h3>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-semibold">
                  {overallAccuracy}% avg accuracy
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Last 12 months — forecast model vs dispatched jobs</p>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalAccuracy} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }}
                      formatter={(value: number, name: string) => [
                        `${value} calls`,
                        name === "forecast" ? "Predicted" : "Actual",
                      ]}
                    />
                    <Legend
                      formatter={(value: string) => (value === "forecast" ? "Predicted" : "Actual")}
                      wrapperStyle={{ fontSize: "13px" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="forecast"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fill="url(#forecastGrad)"
                      dot={{ r: 3, fill: "#2563eb" }}
                      activeDot={{ r: 5 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stroke="#16a34a"
                      strokeWidth={2}
                      fill="url(#actualGrad)"
                      dot={{ r: 3, fill: "#16a34a" }}
                      activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Monthly Accuracy Breakdown */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <div className="p-6">
              <h3 className="font-semibold mb-1">Monthly Accuracy</h3>
              <p className="text-sm text-muted-foreground mb-4">Prediction hit rate by month</p>
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {historicalAccuracy.map((m) => (
                  <div key={m.month} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-16 shrink-0">{m.month}</span>
                    <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all ${
                          m.accuracy >= 90
                            ? "bg-green-500"
                            : m.accuracy >= 85
                            ? "bg-emerald-400"
                            : "bg-yellow-400"
                        }`}
                        style={{ width: `${m.accuracy}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-900">
                        {m.accuracy}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">12-month average</span>
                  <span className="font-bold text-[#16a34a] text-lg">{overallAccuracy}%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Pest-Type Breakdown — Stacked Bar Chart */}
        <Card className="bg-white border-gray-200 shadow-sm mt-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold">Service Calls by Pest Type</h3>
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                Powered by NOAA weather data + historical service records
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Monthly distribution of dispatched jobs by pest category</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pestBreakdown} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }}
                    formatter={(value: number, name: string) => {
                      const labels: Record<string, string> = {
                        fireAnts: "Fire Ants",
                        mosquitoes: "Mosquitoes",
                        termites: "Termites",
                        spiders: "Spiders",
                        ticks: "Ticks",
                        roaches: "Roaches",
                      };
                      return [`${value} calls`, labels[name] || name];
                    }}
                  />
                  <Legend
                    formatter={(value: string) => {
                      const labels: Record<string, string> = {
                        fireAnts: "Fire Ants",
                        mosquitoes: "Mosquitoes",
                        termites: "Termites",
                        spiders: "Spiders",
                        ticks: "Ticks",
                        roaches: "Roaches",
                      };
                      return labels[value] || value;
                    }}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                  <Bar dataKey="fireAnts" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="mosquitoes" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="termites" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="spiders" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="ticks" stackId="a" fill="#10b981" />
                  <Bar dataKey="roaches" stackId="a" fill="#6b7280" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}