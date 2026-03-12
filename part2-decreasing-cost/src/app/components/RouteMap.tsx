import { Card } from "./ui/card";
import { ExternalLink, Navigation } from "lucide-react";

interface RouteStop {
  stop: number;
  customer: string;
  address: string;
  lat: number;
  lng: number;
}

interface RouteMapProps {
  stops: RouteStop[];
  technicianName: string;
  depotAddress: string;
}

function buildGoogleMapsDirectionsUrl(
  depotAddress: string,
  stops: RouteStop[]
) {
  const origin = encodeURIComponent(depotAddress);
  const destination =
    stops.length > 0
      ? encodeURIComponent(stops[stops.length - 1].address)
      : origin;
  const waypoints = stops
    .slice(0, -1)
    .map((s) => encodeURIComponent(s.address))
    .join("/");

  if (waypoints) {
    return `https://www.google.com/maps/dir/${origin}/${waypoints}/${destination}`;
  }
  return `https://www.google.com/maps/dir/${origin}/${destination}`;
}

function buildEmbedUrl(depotAddress: string, stops: RouteStop[]) {
  const origin = encodeURIComponent(depotAddress);
  const destination =
    stops.length > 0
      ? encodeURIComponent(stops[stops.length - 1].address)
      : origin;
  const waypointAddrs = stops
    .slice(0, -1)
    .map((s) => encodeURIComponent(s.address))
    .join("+to:");

  const daddr = waypointAddrs
    ? `${waypointAddrs}+to:${destination}`
    : destination;

  return `https://maps.google.com/maps?saddr=${origin}&daddr=${daddr}&dirflg=d&output=embed`;
}

export function RouteMap({
  stops,
  technicianName,
  depotAddress,
}: RouteMapProps) {
  const directionsUrl = buildGoogleMapsDirectionsUrl(depotAddress, stops);
  const embedUrl = buildEmbedUrl(depotAddress, stops);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Route Map</h3>
          <p className="text-sm text-muted-foreground">
            {technicianName}'s optimized route — {stops.length} stops in Norman,
            OK
          </p>
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Navigation className="w-4 h-4" />
          Open in Google Maps
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Google Maps Embed */}
      <div className="relative w-full h-[450px] rounded-lg border border-border overflow-hidden">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${technicianName}'s route map`}
        />
      </div>

      {/* Stop list below map */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
          <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold shrink-0">
            HQ
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">Depot (Start)</p>
            <p className="text-xs text-muted-foreground truncate">
              {depotAddress}
            </p>
          </div>
        </div>
        {stops.map((stop) => (
          <a
            key={stop.stop}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
              {stop.stop}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{stop.customer}</p>
              <p className="text-xs text-muted-foreground truncate">
                {stop.address}
              </p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </a>
        ))}
      </div>
    </Card>
  );
}
