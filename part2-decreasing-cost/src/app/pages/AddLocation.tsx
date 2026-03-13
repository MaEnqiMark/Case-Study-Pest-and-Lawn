import { useState } from "react";
import { Link } from "react-router";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  MapPin,
  Plus,
  Navigation,
  ExternalLink,
  CheckCircle,
  Clock,
  Trash2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useRoutes, geocodeAddress } from "../context/RoutesContext";

const SERVICE_TYPES = [
  "General Pest Treatment",
  "7-Step Weed Control",
  "Fertilization Service",
  "Termite Inspection",
  "Rodent Control",
  "ProPlus Commercial",
  "Mosquito Treatment",
  "Fire Ant Treatment",
  "Grub Prevention",
  "Lawn Aeration",
];

const FREQUENCIES = [
  "One-time",
  "Monthly",
  "Bi-monthly",
  "Quarterly",
  "Annual",
];

const TECHNICIANS = [
  "Mike Sanders",
  "Jake Wilson",
  "Carlos Ramirez",
  "Derek Brown",
];

export function AddLocation() {
  const { locations, addLocation, removeLocation } = useRoutes();
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [filterTech, setFilterTech] = useState<string>("all");

  // Form state
  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [frequency, setFrequency] = useState("");
  const [assignedTech, setAssignedTech] = useState("");
  const [notes, setNotes] = useState("");

  const resetForm = () => {
    setCustomer("");
    setAddress("");
    setServiceType("");
    setFrequency("");
    setAssignedTech("");
    setNotes("");
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer || !address || !serviceType || !frequency || !assignedTech) {
      return;
    }

    setIsSubmitting(true);

    // Geocode the address to get real coordinates for route optimization
    const coords = await geocodeAddress(address);
    // Fallback to Norman center if geocoding fails
    const lat = coords?.lat ?? 35.2226;
    const lng = coords?.lng ?? -97.4395;

    addLocation({
      customer,
      address,
      lat,
      lng,
      serviceType,
      frequency,
      assignedTech,
      notes,
    });

    setIsSubmitting(false);
    setShowForm(false);
    resetForm();
    setSuccessMessage(
      `${customer} added to ${assignedTech}'s route. AI has re-optimized the stop order.`
    );
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const filteredLocations =
    filterTech === "all"
      ? locations
      : locations.filter((loc) => loc.assignedTech === filterTech);

  const locationsByTech = TECHNICIANS.map((tech) => ({
    tech,
    count: locations.filter((loc) => loc.assignedTech === tech).length,
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Customers</h1>
          <p className="text-muted-foreground">
            Manage customers and assign them to technician routes
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) resetForm();
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Cancel" : "Add Customer"}
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Card className="p-4 bg-accent/5 border-accent/20">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-accent shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-accent">{successMessage}</p>
            </div>
            <Link
              to="/route-planning"
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              View Routes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      )}

      {/* Add Customer Form */}
      {showForm && (
        <Card className="p-6 border-primary/20 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">New Customer</h2>
              <p className="text-sm text-muted-foreground">
                Add a customer and assign to a technician — the AI will automatically re-optimize their route
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Customer Name */}
              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name *</Label>
                <Input
                  id="customer"
                  placeholder="e.g. John Smith"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="e.g. 1234 Main St, Norman, OK 73069"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              {/* Service Type */}
              <div className="space-y-2">
                <Label>Service Type *</Label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Frequency */}
              <div className="space-y-2">
                <Label>Frequency *</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Assign Technician */}
              <div className="space-y-2">
                <Label>Assign Technician *</Label>
                <Select value={assignedTech} onValueChange={setAssignedTech}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {TECHNICIANS.map((tech) => {
                      const count = locations.filter(
                        (l) => l.assignedTech === tech
                      ).length;
                      return (
                        <SelectItem key={tech} value={tech}>
                          {tech} ({count} stops)
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="e.g. Gate code 1234, dogs in backyard"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <Separator />

            {/* AI optimization callout */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
              <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">AI Route Optimization</p>
                <p className="text-sm text-muted-foreground mt-1">
                  When you add this stop, the AI nearest-neighbor algorithm will
                  automatically recalculate the optimal visit order for the
                  assigned technician's route, minimizing total drive miles.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-60"
              >
                <Plus className="w-4 h-4" />
                {isSubmitting ? "Geocoding & optimizing..." : "Add to Route"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-6 py-2.5 rounded-lg bg-muted text-muted-foreground font-medium text-sm hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Tech Distribution Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {locationsByTech.map(({ tech, count }) => (
          <Card
            key={tech}
            className={`p-4 cursor-pointer transition-all ${
              filterTech === tech
                ? "border-primary/40 bg-primary/5"
                : "hover:border-border/80"
            }`}
            onClick={() =>
              setFilterTech(filterTech === tech ? "all" : tech)
            }
          >
            <p className="text-sm text-muted-foreground">{tech}</p>
            <p className="text-2xl font-semibold mt-1">{count}</p>
            <p className="text-xs text-muted-foreground">customers</p>
          </Card>
        ))}
      </div>

      {/* Customers Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold">
              All Customers ({filteredLocations.length})
            </h3>
            {filterTech !== "all" && (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 cursor-pointer"
                onClick={() => setFilterTech("all")}
              >
                {filterTech} ✕
              </Badge>
            )}
          </div>
          <a
            href={`https://www.google.com/maps/dir/${filteredLocations
              .map((l) => encodeURIComponent(l.address))
              .join("/")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            View All on Map
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Customer</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.map((loc) => (
                <TableRow key={loc.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <div>
                      <Link
                        to={`/customer/${loc.id}`}
                        className="hover:underline hover:text-primary transition-colors"
                      >
                        {loc.customer}
                      </Link>
                      {loc.notes && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {loc.notes}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary hover:underline transition-colors"
                    >
                      {loc.address}
                    </a>
                  </TableCell>
                  <TableCell>{loc.serviceType}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      {loc.frequency}
                    </div>
                  </TableCell>
                  <TableCell>{loc.assignedTech}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        loc.status === "active"
                          ? "bg-accent/10 text-accent border-accent/20"
                          : loc.status === "new"
                          ? "bg-chart-3/10 text-chart-3 border-chart-3/20"
                          : "bg-muted text-muted-foreground border-border"
                      }
                    >
                      {loc.status === "active"
                        ? "Active"
                        : loc.status === "new"
                        ? "New"
                        : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {loc.status === "new" && (
                      <button
                        onClick={() => removeLocation(loc.id)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
