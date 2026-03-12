import { useParams, Link } from "react-router";
import { useState } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { KPICard } from "../components/KPICard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  User,
  Truck,
  Award,
  Calendar,
  TrendingUp,
  Clock,
  Briefcase,
  ArrowLeft,
} from "lucide-react";
import { useReports, CommittedReport } from "../context/ReportsContext";
import { useRoutes, TECHNICIAN_CONFIGS } from "../context/RoutesContext";

export function TechnicianProfile() {
  const { id } = useParams<{ id: string }>();
  const { getReportsByTechnician } = useReports();
  const { routes, locations } = useRoutes();

  // Find tech config and route from context
  const techConfig = TECHNICIAN_CONFIGS.find((t) => t.id === id);
  const techRoute = routes.find((r) => r.id === id);
  const techLocations = locations.filter((l) => l.assignedTech === techConfig?.name);
  const committedReports = id ? getReportsByTechnician(id) : [];

  const [selectedReport, setSelectedReport] = useState<CommittedReport | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleReportClick = (report: CommittedReport) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  if (!techConfig || !techRoute) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Technician not found</p>
          <Link to="/scheduling">
            <Button className="mt-4">Back to Scheduling</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Compute live KPIs from route data
  const totalServiceTime = techRoute.stops.reduce((sum, s) => sum + s.duration, 0);
  const driveTimeMins = Math.round(techRoute.optimizedMiles * 3);
  const utilization = Math.round(((totalServiceTime + driveTimeMins) / 480) * 100);
  const avgDuration = techRoute.stops.length > 0
    ? Math.round(totalServiceTime / techRoute.stops.length)
    : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/scheduling">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-semibold">{techConfig.name}</h1>
          <p className="text-muted-foreground capitalize">{techConfig.specialty}</p>
        </div>
      </div>

      {/* Technician Info */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Technician Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/5">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Specialty</p>
              <p className="font-semibold capitalize">{techConfig.specialty}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/5">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vehicle</p>
              <p className="font-semibold">{techConfig.vehicle}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/5">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hire Date</p>
              <p className="font-semibold">{techConfig.hireDate}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/5">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Certifications</p>
              <p className="font-semibold">{techConfig.certifications.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Certifications
          </h3>
          <div className="flex flex-wrap gap-2">
            {techConfig.certifications.map((cert) => (
              <Badge
                key={cert}
                variant="secondary"
                className="bg-accent/10 text-accent border-accent/20"
              >
                {cert}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Performance Metrics — live from context */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            title="Today's Jobs"
            value={techRoute.stops.length}
            icon={Briefcase}
            iconColor="text-primary"
          />
          <KPICard
            title="Utilization Rate"
            value={`${utilization}%`}
            icon={TrendingUp}
            iconColor="text-accent"
          />
          <KPICard
            title="Avg Service Duration"
            value={`${avgDuration} min`}
            icon={Clock}
            iconColor="text-chart-3"
          />
          <KPICard
            title="Miles Saved"
            value={`${techRoute.savedMiles.toFixed(1)} mi`}
            icon={TrendingUp}
            iconColor="text-chart-2"
          />
        </div>
      </div>

      {/* Recent Reports from context */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold">Recent Reports</h2>
        </div>
        {committedReports.length > 0 ? (
          <div className="p-6 space-y-4">
            {committedReports.map((report) => (
              <div
                key={report.id}
                onClick={() => handleReportClick(report)}
                className="p-4 bg-muted/30 rounded-lg border border-border cursor-pointer hover:bg-muted/50 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{report.customer}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.serviceType}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-muted">
                    {report.date}
                  </Badge>
                </div>
                <p className="text-sm text-foreground line-clamp-2">{report.notes || report.servicePerformed}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            <p>No committed reports yet</p>
            <p className="text-sm mt-1">Reports will appear here after being committed via Tech Reports</p>
          </div>
        )}
      </Card>

      {/* Report Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Service Report</DialogTitle>
            <DialogDescription>
              Detailed report for {selectedReport?.customer}
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Customer</p>
                  <p className="text-lg font-semibold mt-1">{selectedReport.customer}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Date</p>
                  <p className="text-lg font-semibold mt-1">{selectedReport.date}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Service Type</p>
                  <p className="text-lg font-semibold mt-1">{selectedReport.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Time on Site</p>
                  <p className="text-lg font-semibold mt-1">{selectedReport.timeOnSite} minutes</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Service Performed</h3>
                <p className="text-foreground bg-muted/30 p-3 rounded-lg">{selectedReport.servicePerformed || "No details provided"}</p>
              </div>

              {selectedReport.productsUsed && selectedReport.productsUsed.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Products Used</h3>
                  <div className="space-y-2">
                    {selectedReport.productsUsed.map((product, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted/30 p-3 rounded-lg">
                        <span className="font-medium">{product.name}</span>
                        <Badge variant="secondary">{product.quantity}x</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Areas Serviced</h3>
                <p className="text-foreground bg-muted/30 p-3 rounded-lg whitespace-pre-wrap">{selectedReport.areasServiced || "No details provided"}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Issues Found</h3>
                <p className="text-foreground bg-muted/30 p-3 rounded-lg">{selectedReport.issuesFound || "No issues reported"}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Recommendations</h3>
                <p className="text-foreground bg-muted/30 p-3 rounded-lg whitespace-pre-wrap">{selectedReport.recommendations || "No recommendations"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Follow-up Needed</p>
                  <Badge variant="outline" className={selectedReport.followUpNeeded ? "bg-warning/10 text-warning border-warning/20 mt-2" : "bg-accent/10 text-accent border-accent/20 mt-2"}>
                    {selectedReport.followUpNeeded ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Customer Present</p>
                  <Badge variant="outline" className="bg-muted mt-2">
                    {selectedReport.customerPresent ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              {selectedReport.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Field Notes</h3>
                  <p className="text-foreground bg-muted/30 p-3 rounded-lg">{selectedReport.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Today's Route — live from context */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Today's Route ({techRoute.stops.length} stops)</h2>
          <div className="text-sm text-muted-foreground">
            {techRoute.optimizedMiles.toFixed(1)} mi optimized
            {techRoute.savedMiles > 0 && (
              <span className="text-accent ml-2">({techRoute.savedMiles.toFixed(1)} mi saved)</span>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">Stop</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="text-right">Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {techRoute.stops.map((stop) => (
                <TableRow key={stop.stop} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      {stop.stop}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{stop.customer}</TableCell>
                  <TableCell>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary hover:underline text-sm"
                    >
                      {stop.address}
                    </a>
                  </TableCell>
                  <TableCell>{stop.service}</TableCell>
                  <TableCell className="text-right">{stop.duration} min</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        stop.status === "completed"
                          ? "bg-accent/10 text-accent border-accent/20"
                          : stop.status === "in-progress"
                          ? "bg-chart-3/10 text-chart-3 border-chart-3/20"
                          : "bg-muted text-muted-foreground border-border"
                      }
                    >
                      {stop.status === "completed" ? "Completed" : stop.status === "in-progress" ? "In Progress" : "Scheduled"}
                    </Badge>
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
