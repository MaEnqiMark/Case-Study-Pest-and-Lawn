import { useState } from "react";
import { Badge } from "./ui/badge";
import { MapPin } from "lucide-react";

// ── Risk zones as large areas with size/spread ────────────────────────────
interface RiskZone {
  name: string;
  level: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  pest: string;
  // Position & size as percentage of map container
  top: string;
  left: string;
  width: string;
  height: string;
}

const riskZones: RiskZone[] = [
  {
    name: "Lake Thunderbird",
    level: "CRITICAL",
    pest: "Mosquitoes",
    top: "48%",
    left: "65%",
    width: "22%",
    height: "28%",
  },
  {
    name: "South Norman",
    level: "HIGH",
    pest: "Fire Ants",
    top: "52%",
    left: "32%",
    width: "20%",
    height: "24%",
  },
  {
    name: "Moore",
    level: "HIGH",
    pest: "Fire Ants",
    top: "24%",
    left: "36%",
    width: "18%",
    height: "20%",
  },
  {
    name: "Downtown Norman",
    level: "MODERATE",
    pest: "Termites",
    top: "42%",
    left: "42%",
    width: "16%",
    height: "18%",
  },
  {
    name: "East Norman",
    level: "MODERATE",
    pest: "Brown Recluse",
    top: "40%",
    left: "54%",
    width: "14%",
    height: "16%",
  },
  {
    name: "Noble / Rural South",
    level: "LOW",
    pest: "Ticks",
    top: "68%",
    left: "44%",
    width: "24%",
    height: "20%",
  },
  {
    name: "Midwest City",
    level: "MODERATE",
    pest: "German Cockroaches",
    top: "18%",
    left: "58%",
    width: "16%",
    height: "16%",
  },
  {
    name: "Blanchard / Rural West",
    level: "LOW",
    pest: "Ticks",
    top: "55%",
    left: "14%",
    width: "18%",
    height: "22%",
  },
];

const levelStyles: Record<
  RiskZone["level"],
  { color: string; opacity: string; border: string; badgeCls: string }
> = {
  CRITICAL: {
    color: "rgba(239, 68, 68, 0.55)",
    opacity: "0.95",
    border: "rgba(239, 68, 68, 0.7)",
    badgeCls: "bg-red-50 text-red-700 border-red-200",
  },
  HIGH: {
    color: "rgba(249, 115, 22, 0.50)",
    opacity: "0.9",
    border: "rgba(249, 115, 22, 0.65)",
    badgeCls: "bg-orange-50 text-orange-700 border-orange-200",
  },
  MODERATE: {
    color: "rgba(234, 179, 8, 0.45)",
    opacity: "0.85",
    border: "rgba(234, 179, 8, 0.6)",
    badgeCls: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  LOW: {
    color: "rgba(34, 197, 94, 0.35)",
    opacity: "0.8",
    border: "rgba(34, 197, 94, 0.5)",
    badgeCls: "bg-green-50 text-green-700 border-green-200",
  },
};

// Zoomed-out Google Maps embed — ~50 mi radius around Norman, OK — interaction disabled
// Zoom ~10 (1d=420000 gives roughly 50-mi view), centered on Norman/OKC metro
const MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d420000!2d-97.38!3d35.28!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus";

export function LivePestRiskMap() {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden relative">
      {/* Map Container */}
      <div className="relative w-full" style={{ height: "600px" }}>
        {/* Google Maps embed — pointer-events disabled so map can't be moved */}
        <iframe
          src={MAPS_EMBED_URL}
          className="absolute inset-0 w-full h-full border-0"
          style={{ pointerEvents: "none" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Norman OK Service Area — 50 mi Radius"
        />

        {/* Heatmap area overlays */}
        <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
          {riskZones.map((zone) => {
            const style = levelStyles[zone.level];
            const isActive = activeZone === zone.name;

            return (
              <div
                key={zone.name}
                className="absolute transition-all duration-300"
                style={{
                  top: zone.top,
                  left: zone.left,
                  width: zone.width,
                  height: zone.height,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "auto",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setActiveZone(zone.name)}
                onMouseLeave={() => setActiveZone(null)}
              >
                {/* Large blurred heatmap blob */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(ellipse at center, ${style.color} 0%, ${style.color.replace(/[\d.]+\)$/, "0.25)")} 55%, transparent 80%)`,
                    filter: "blur(6px)",
                    opacity: style.opacity,
                    transform: isActive ? "scale(1.1)" : "scale(1)",
                    transition: "transform 0.3s ease",
                  }}
                />

                {/* Inner ring border */}
                <div
                  className="absolute rounded-full"
                  style={{
                    inset: "15%",
                    border: `2px dashed ${style.border}`,
                    opacity: isActive ? 1 : 0.5,
                    transition: "opacity 0.3s ease",
                  }}
                />

                {/* Center label */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ pointerEvents: "none" }}
                >
                  <div
                    className={`
                      bg-white/95 backdrop-blur rounded-lg shadow-md px-2.5 py-1.5 text-center
                      transition-all duration-200 border border-gray-200
                      ${isActive ? "scale-110 shadow-lg" : ""}
                    `}
                  >
                    <p className="text-xs font-semibold text-gray-900 leading-tight">
                      {zone.name}
                    </p>
                    <p className="text-[10px] text-gray-500">{zone.pest}</p>
                  </div>
                </div>

                {/* Expanded tooltip on hover */}
                {isActive && (
                  <div
                    className="absolute z-20 bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[180px]"
                    style={{
                      bottom: "105%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <p className="font-semibold text-sm text-gray-900">
                      {zone.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Primary threat: {zone.pest}
                    </p>
                    <Badge
                      variant="outline"
                      className={`mt-1.5 text-xs font-semibold ${style.badgeCls}`}
                    >
                      {zone.level} RISK
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* LEGEND */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-lg border border-gray-200 shadow-lg p-3 max-w-[180px] z-10">
          <p className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide">
            Pest Risk Intensity
          </p>
          <div className="space-y-1.5">
            {(["LOW", "MODERATE", "HIGH", "CRITICAL"] as const).map((level) => (
              <div key={level} className="flex items-center gap-2">
                <div
                  className="w-6 h-3 rounded"
                  style={{
                    background: levelStyles[level].color.replace(
                      /[\d.]+\)$/,
                      "0.7)"
                    ),
                  }}
                />
                <span className="text-xs text-gray-700 capitalize">
                  {level.toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* LIVE INDICATOR */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-lg border border-gray-200 shadow-lg px-3 py-2 flex items-center gap-2 z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
            <div className="relative w-2 h-2 bg-green-500 rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-900">
              Live forecast model
            </span>
            <span className="text-xs text-gray-500">
              NOAA + historical data
            </span>
          </div>
        </div>

        {/* RADIUS BADGE */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur rounded-lg border border-gray-200 shadow-lg px-3 py-2 z-10">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#16a34a]" />
            <span className="text-xs text-gray-600">
              Norman, OK • ~50 mi service radius
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <strong className="text-gray-900">Regional heatmap:</strong>{" "}
            Shaded zones show predicted pest concentration areas. Hover a zone
            for details.
          </p>
          <div className="flex gap-2 shrink-0 ml-4">
            {riskZones
              .filter((z) => z.level === "CRITICAL" || z.level === "HIGH")
              .map((z) => (
                <Badge
                  key={z.name}
                  variant="outline"
                  className={`${levelStyles[z.level].badgeCls} text-xs`}
                >
                  {z.name}: {z.pest}
                </Badge>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
