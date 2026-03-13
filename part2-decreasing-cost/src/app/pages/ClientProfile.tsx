import { useState } from "react";
import { useParams, Link } from "react-router";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Separator } from "../components/ui/separator";
import {
  ArrowLeft,
  Phone,
  CalendarPlus,
  MapPin,
  User,
  Clock,
  Wrench,
  FileText,
  Sparkles,
  ShieldCheck,
  DollarSign,
  MessageSquare,
  AlertCircle,
  Plus,
  Mail,
  ExternalLink,
  Bug,
  Leaf,
  Home,
  Send,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useRoutes } from "../context/RoutesContext";

// ── Email API (Vercel serverless function — same domain, no CORS issues) ────
const EMAIL_API_URL = "/api/send-email";
const PROMO_RECIPIENT = "markma18@seas.upenn.edu";

// ── Helper: determine service category ──────────────────────────────────────

function getServiceCategory(serviceType: string): "pest" | "lawn" | "termite" {
  const lower = serviceType.toLowerCase();
  if (lower.includes("termite")) return "termite";
  if (
    lower.includes("lawn") ||
    lower.includes("weed") ||
    lower.includes("fertiliz") ||
    lower.includes("aeration") ||
    lower.includes("grub") ||
    lower.includes("soil")
  )
    return "lawn";
  return "pest";
}

// ── Helper: generate property status ────────────────────────────────────────

function getPropertyStatus(category: "pest" | "lawn" | "termite"): { label: string; color: string } {
  switch (category) {
    case "pest":
      return { label: "Under Active Treatment", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" };
    case "lawn":
      return { label: "Lawn Health: Good", color: "bg-accent/10 text-accent border-accent/20" };
    case "termite":
      return { label: "Inspection Monitoring", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
  }
}

// ── Helper: AI summary ──────────────────────────────────────────────────────

function getAISummary(category: "pest" | "lawn" | "termite"): string {
  switch (category) {
    case "pest":
      return "Property shows signs of seasonal pest activity. Regular treatments maintaining effective barrier. Recommend continuing current treatment schedule with additional perimeter check before spring peak.";
    case "lawn":
      return "Lawn health trending positive with consistent care schedule. Soil conditions optimal for current treatment plan. Spring fertilization window approaching \u2014 schedule pre-emergent within 2 weeks.";
    case "termite":
      return "Annual inspection due. Previous inspection clear. Property structure in good condition. Monitor moisture levels near foundation during spring rains.";
  }
}

// ── Helper: mock service history ────────────────────────────────────────────

function generateServiceHistory(serviceType: string, tech: string) {
  const today = new Date();
  const entries = [
    { daysAgo: 7, status: "Completed" as const, notes: "Standard treatment applied. No issues found." },
    { daysAgo: 37, status: "Completed" as const, notes: "Full perimeter treatment. Customer reported minor activity near garage." },
    { daysAgo: 68, status: "Completed" as const, notes: "Routine service visit. All areas treated per plan." },
    { daysAgo: 95, status: "Completed" as const, notes: "Seasonal treatment adjustment. Added spot treatment near foundation." },
    { daysAgo: 130, status: "Completed" as const, notes: "Initial service setup. Baseline inspection completed." },
  ];

  return entries.map((entry, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - entry.daysAgo);
    return {
      id: i + 1,
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      serviceType,
      technician: tech,
      status: entry.status,
      notes: entry.notes,
    };
  });
}

// ── Helper: risk zone for coordinates ───────────────────────────────────────

function getRiskZone(lat: number, lng: number): { zone: string; level: string; threats: string[] } {
  // Simple coordinate-based zone classification for Norman, OK area
  if (lng < -97.48) {
    return { zone: "West Norman", level: "MODERATE", threats: ["Fire Ants", "Mosquitoes"] };
  } else if (lng > -97.42) {
    return { zone: "East Norman", level: "MODERATE", threats: ["Brown Recluse", "Termites"] };
  } else if (lat < 35.21) {
    return { zone: "South Norman", level: "HIGH", threats: ["Fire Ants", "Ticks"] };
  } else if (lat > 35.23) {
    return { zone: "North Norman", level: "LOW", threats: ["German Cockroaches", "Spiders"] };
  }
  return { zone: "Downtown Norman", level: "MODERATE", threats: ["Termites", "Brown Recluse"] };
}

// ── Helper: cross-sell opportunities ────────────────────────────────────────

function getCrossSellOpportunities(category: "pest" | "lawn" | "termite") {
  switch (category) {
    case "pest":
      return [
        { service: "Lawn Care Program", description: "7-step weed control & fertilization", revenue: 65, icon: Leaf },
        { service: "Mosquito Treatment", description: "Monthly perimeter misting barrier", revenue: 85, icon: Bug },
        { service: "Termite Inspection", description: "Annual wood-destroying insect report", revenue: 150, icon: ShieldCheck },
      ];
    case "lawn":
      return [
        { service: "General Pest Control", description: "Quarterly interior & exterior treatment", revenue: 75, icon: Bug },
        { service: "Grub Prevention", description: "Preventative grub treatment application", revenue: 55, icon: Leaf },
        { service: "Soil Testing & Analysis", description: "Comprehensive soil health report", revenue: 45, icon: FileText },
      ];
    case "termite":
      return [
        { service: "General Pest Control", description: "Quarterly interior & exterior treatment", revenue: 75, icon: Bug },
        { service: "Moisture Control", description: "Crawlspace encapsulation & monitoring", revenue: 200, icon: Home },
        { service: "Lawn Care Program", description: "7-step weed control & fertilization", revenue: 65, icon: Leaf },
      ];
  }
}

// ── Helper: contact history ─────────────────────────────────────────────────

function generateContactHistory() {
  const today = new Date();
  return [
    {
      daysAgo: 3,
      type: "Phone Call" as const,
      icon: Phone,
      summary: "Confirmed upcoming service appointment. Customer requested morning slot.",
    },
    {
      daysAgo: 12,
      type: "Email" as const,
      icon: Mail,
      summary: "Sent quarterly service summary and renewal notice.",
    },
    {
      daysAgo: 37,
      type: "Service Visit" as const,
      icon: Wrench,
      summary: "On-site service completed. Technician discussed treatment plan with customer.",
    },
    {
      daysAgo: 45,
      type: "Phone Call" as const,
      icon: Phone,
      summary: "Customer called to report minor pest activity near kitchen. Scheduled follow-up.",
    },
  ].map((entry) => {
    const date = new Date(today);
    date.setDate(date.getDate() - entry.daysAgo);
    return {
      ...entry,
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
  });
}

// ── Helper: pending actions ─────────────────────────────────────────────────

function getPendingActions(category: "pest" | "lawn" | "termite") {
  const baseActions = [
    { action: "Send quarterly service reminder", status: "upcoming" as const, dueIn: "5 days" },
  ];

  switch (category) {
    case "pest":
      return [
        { action: "Schedule spring perimeter re-treatment", status: "pending" as const, dueIn: "2 weeks" },
        ...baseActions,
        { action: "Follow up on garage pest activity report", status: "overdue" as const, dueIn: "3 days ago" },
      ];
    case "lawn":
      return [
        { action: "Schedule spring pre-emergent treatment", status: "pending" as const, dueIn: "1 week" },
        ...baseActions,
        { action: "Soil test results review with customer", status: "upcoming" as const, dueIn: "10 days" },
      ];
    case "termite":
      return [
        { action: "Follow up on termite inspection results", status: "overdue" as const, dueIn: "5 days ago" },
        { action: "Schedule annual re-inspection", status: "pending" as const, dueIn: "3 weeks" },
        ...baseActions,
      ];
  }
}

// ── Component ───────────────────────────────────────────────────────────────

export function ClientProfile() {
  const { id } = useParams<{ id: string }>();
  const { locations } = useRoutes();
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [emailError, setEmailError] = useState("");

  const sendPromoEmail = async (
    customerName: string,
    services: { service: string; description: string; revenue: number }[],
  ) => {
    setEmailStatus("sending");
    setEmailError("");

    const serviceList = services
      .map((s) => `• ${s.service} – ${s.description} ($${s.revenue}/mo)`)
      .join("\n");

    const totalSavings = services.reduce((s, i) => s + i.revenue, 0);
    const bundlePrice = Math.round(totalSavings * 0.85);

    const subject = `Exclusive Offer for ${customerName} – Save on Additional Services`;
    const body =
      `Name: ${customerName}\n` +
      `Email: ${PROMO_RECIPIENT}\n` +
      `Service: Cross-Sell Promotion\n` +
      `Message: Hi ${customerName},\n\n` +
      `Based on your current service plan, our AI analysis has identified additional services that could benefit your property:\n\n` +
      `${serviceList}\n\n` +
      `Bundle all three for a combined rate of $${bundlePrice}/mo (15% bundle discount!).\n\n` +
      `These recommendations are tailored to your property's specific needs, location risk profile, and treatment history.\n\n` +
      `Reply to this email or call us at (555) 123-4567 to get started.\n\n` +
      `Best regards,\nPestxLawn Pest & Lawn Care\nNorman, OK`;

    try {
      const res = await fetch(EMAIL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: PROMO_RECIPIENT, subject, body }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("Email sent:", data);
      setEmailStatus("sent");
      setTimeout(() => setEmailStatus("idle"), 5000);
    } catch (err: any) {
      console.error("Email send error:", err);
      setEmailError(err?.message || "Failed to send email");
      setEmailStatus("error");
      setTimeout(() => setEmailStatus("idle"), 5000);
    }
  };

  const location = locations.find((l) => l.id === id);

  if (!location) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Customer not found</p>
          <Link to="/customers">
            <Button className="mt-4">Back to Customers</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const category = getServiceCategory(location.serviceType);
  const propertyStatus = getPropertyStatus(category);
  const aiSummary = getAISummary(category);
  const serviceHistory = generateServiceHistory(location.serviceType, location.assignedTech);
  const riskZone = getRiskZone(location.lat, location.lng);
  const crossSell = getCrossSellOpportunities(category);
  const contactHistory = generateContactHistory();
  const pendingActions = getPendingActions(category);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=15&size=400x200&markers=color:red%7C${location.lat},${location.lng}&key=YOUR_KEY`;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/customers">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold">{location.customer}</h1>
              <Badge
                variant="outline"
                className={
                  location.status === "active"
                    ? "bg-accent/10 text-accent border-accent/20"
                    : location.status === "new"
                    ? "bg-chart-3/10 text-chart-3 border-chart-3/20"
                    : "bg-muted text-muted-foreground border-border"
                }
              >
                {location.status === "active" ? "Active" : location.status === "new" ? "New" : "Pending"}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-0.5">{location.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Phone className="w-4 h-4" />
            Contact Customer
          </Button>
          <Button className="gap-2">
            <CalendarPlus className="w-4 h-4" />
            Schedule Service
          </Button>
        </div>
      </div>

      {/* ── Main Grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column (2/3) ─────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Client Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold mt-0.5">{location.customer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold mt-0.5 text-primary hover:underline inline-flex items-center gap-1"
                >
                  {location.address}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Service Type</p>
                <p className="font-semibold mt-0.5">{location.serviceType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Frequency</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="font-semibold">{location.frequency}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assigned Technician</p>
                <p className="font-semibold mt-0.5">{location.assignedTech}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="font-semibold mt-0.5">{location.notes || "No notes"}</p>
              </div>
            </div>

            <Separator className="my-5" />

            <div className="flex items-center gap-3">
              <Home className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Property Status:</span>
              <Badge variant="outline" className={propertyStatus.color}>
                {propertyStatus.label}
              </Badge>
            </div>
          </Card>

          {/* AI Summary Card */}
          <Card className="p-6 border-accent/20 bg-accent/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">AI Property Summary</h2>
                <p className="text-xs text-muted-foreground">Generated analysis based on service history and property data</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-foreground">{aiSummary}</p>
          </Card>

          {/* Service History Card */}
          <Card className="overflow-hidden">
            <div className="p-5 border-b border-border bg-muted/30 flex items-center gap-3">
              <Wrench className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Service History</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceHistory.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-muted/30">
                      <TableCell className="whitespace-nowrap">{entry.date}</TableCell>
                      <TableCell>{entry.serviceType}</TableCell>
                      <TableCell>{entry.technician}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {entry.notes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Cross-Sell Opportunities Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-chart-3/10">
                <DollarSign className="w-5 h-5 text-chart-3" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Cross-Sell Opportunities</h2>
                <p className="text-xs text-muted-foreground">Additional services to grow this account</p>
              </div>
            </div>
            <div className="space-y-4">
              {crossSell.map((item) => (
                <div
                  key={item.service}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/5">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.service}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-accent">${item.revenue}/mo</p>
                      <p className="text-xs text-muted-foreground">est. revenue</p>
                    </div>
                    <Button size="sm" variant="outline" className="gap-1.5">
                      <Plus className="w-3.5 h-3.5" />
                      Add to Plan
                    </Button>
                  </div>
                </div>
              ))}
              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total potential:
                    <span className="font-semibold text-accent ml-1">
                      ${crossSell.reduce((sum, item) => sum + item.revenue, 0)}/mo
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Bundle discount: <span className="font-semibold text-accent">${Math.round(crossSell.reduce((sum, item) => sum + item.revenue, 0) * 0.85)}/mo</span> (15% off)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {emailStatus === "sent" && (
                    <span className="flex items-center gap-1.5 text-sm text-accent">
                      <CheckCircle className="w-4 h-4" />
                      Email sent!
                    </span>
                  )}
                  {emailStatus === "error" && (
                    <span className="flex items-center gap-1.5 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      {emailError || "Send failed"}
                    </span>
                  )}
                  <Button
                    onClick={() => sendPromoEmail(location.customer, crossSell)}
                    disabled={emailStatus === "sending" || emailStatus === "sent"}
                    className="gap-2 bg-chart-3 hover:bg-chart-3/90 text-white"
                  >
                    {emailStatus === "sending" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending…
                      </>
                    ) : emailStatus === "sent" ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Sent
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Promo Email
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Sends a personalized promotional email to <span className="font-mono">{PROMO_RECIPIENT}</span> with bundled service recommendations
              </p>
            </div>
          </Card>
        </div>

        {/* ── Right column (1/3) ────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Location & Forecasting Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Location & Risk</h2>
            </div>

            {/* Mini map embed (OpenStreetMap) */}
            <div className="rounded-lg overflow-hidden border border-border mb-4">
              <iframe
                title="Property Location"
                width="100%"
                height="180"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.008}%2C${location.lat - 0.005}%2C${location.lng + 0.008}%2C${location.lat + 0.005}&layer=mapnik&marker=${location.lat}%2C${location.lng}`}
              />
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Coordinates</span>
                <span className="font-mono text-xs">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Risk Zone</span>
                <Badge
                  variant="outline"
                  className={
                    riskZone.level === "CRITICAL"
                      ? "bg-destructive/10 text-destructive border-destructive/20"
                      : riskZone.level === "HIGH"
                      ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                      : riskZone.level === "MODERATE"
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      : "bg-accent/10 text-accent border-accent/20"
                  }
                >
                  {riskZone.zone} - {riskZone.level}
                </Badge>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-2">Area Pest Threats</p>
                <div className="flex flex-wrap gap-1.5">
                  {riskZone.threats.map((threat) => (
                    <Badge key={threat} variant="secondary" className="text-xs">
                      <Bug className="w-3 h-3 mr-1" />
                      {threat}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Contact History Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Contact History</h2>
            </div>
            <div className="space-y-4">
              {contactHistory.map((entry, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-muted mt-0.5">
                    <entry.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{entry.type}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{entry.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{entry.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pending Actions Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-chart-3/10">
                <AlertCircle className="w-5 h-5 text-chart-3" />
              </div>
              <h2 className="text-lg font-semibold">Pending Actions</h2>
            </div>
            <div className="space-y-3">
              {pendingActions.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/20"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      item.status === "overdue"
                        ? "bg-destructive"
                        : item.status === "pending"
                        ? "bg-amber-500"
                        : "bg-accent"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          item.status === "overdue"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : item.status === "pending"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-accent/10 text-accent border-accent/20"
                        }`}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.dueIn}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
