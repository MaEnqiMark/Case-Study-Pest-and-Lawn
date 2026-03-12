import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Mic, FileText, Plus, X, CheckCircle, Sparkles, RotateCcw } from "lucide-react";
import { useInventory } from "../context/InventoryContext";
import { useReports } from "../context/ReportsContext";

interface ProductUsage {
  name: string;
  quantity: number;
}

const technicianMap: Record<string, { id: string; name: string }> = {
  mike: { id: "mike-sanders", name: "Mike Sanders" },
  jake: { id: "jake-wilson", name: "Jake Wilson" },
  carlos: { id: "carlos-ramirez", name: "Carlos Ramirez" },
  derek: { id: "derek-brown", name: "Derek Brown" },
};

const serviceTypeMap: Record<string, string> = {
  pest: "Pest Control",
  lawn: "Lawn Care",
  termite: "Termite Treatment",
  weed: "Weed Control",
};

// Default products by service type — simulates AI picking the right chemicals
const defaultProductsByService: Record<string, ProductUsage[]> = {
  pest: [
    { name: "Bifenthrin 7.9F", quantity: 1 },
    { name: "Fipronil Gel Bait", quantity: 2 },
  ],
  lawn: [
    { name: "Tenacity Herbicide", quantity: 1 },
    { name: "Certainty Turf", quantity: 1 },
  ],
  termite: [
    { name: "Termidor SC", quantity: 1 },
    { name: "Altriset", quantity: 1 },
  ],
  weed: [
    { name: "Tenacity Herbicide", quantity: 1 },
    { name: "Certainty Turf", quantity: 2 },
  ],
};

// Simulates AI report generation from transcript + context
function generateStructuredReport(
  transcript: string,
  serviceType: string,
  customerName: string,
  techName: string
): {
  servicePerformed: string;
  areasServiced: string;
  issuesFound: string;
  recommendations: string;
  followUp: boolean;
  timeOnSite: number;
  products: ProductUsage[];
} {
  const serviceName = serviceTypeMap[serviceType] || "General Service";
  const name = customerName || "the customer";
  const notes = transcript.trim();

  // Parse transcript for keywords to generate context-aware content
  const hasInterior = /interior|inside|indoor|kitchen|bathroom|bedroom|living|room/i.test(notes);
  const hasExterior = /exterior|outside|outdoor|yard|lawn|perimeter|foundation|garden/i.test(notes);
  const hasInfestation = /infestation|heavy|severe|major|significant|lots of|many/i.test(notes);
  const hasMoisture = /moisture|water|leak|damp|wet/i.test(notes);
  const hasBurrow = /burrow|hole|tunnel|nest|mound/i.test(notes);
  const hasWeeds = /weed|crabgrass|dandelion|clover|broadleaf/i.test(notes);

  // Build areas
  const areas: string[] = [];
  if (hasInterior) areas.push("Interior rooms (kitchen, bathrooms, baseboards)");
  if (hasExterior) areas.push("Exterior perimeter and foundation");
  if (!hasInterior && !hasExterior) {
    areas.push("Exterior perimeter — 3ft band around foundation");
    areas.push("Interior baseboards — kitchen, bathrooms, utility room");
  }

  // Build issues
  const issues: string[] = [];
  if (hasInfestation) issues.push("Signs of active infestation observed");
  if (hasMoisture) issues.push("Moisture buildup detected near treatment areas — potential attractant");
  if (hasBurrow) issues.push("Burrow activity found along property edge");
  if (hasWeeds) issues.push("Broadleaf weed pressure exceeding threshold in treated zones");
  if (issues.length === 0) {
    if (serviceType === "pest") issues.push("Minor pest activity along exterior foundation — within expected seasonal range");
    else if (serviceType === "termite") issues.push("No active termite activity detected in monitored stations");
    else if (serviceType === "weed") issues.push("Pre-emergent barrier holding well — minor breakthrough in high-traffic areas");
    else issues.push("Lawn health within expected parameters — minor thin spots noted");
  }

  // Build recs
  const recs: string[] = [];
  if (hasInfestation) {
    recs.push("Schedule follow-up treatment in 14 days to break reproductive cycle");
    recs.push("Seal entry points around utility penetrations");
  }
  if (hasMoisture) {
    recs.push("Address moisture issue before next service to improve treatment efficacy");
  }
  if (hasWeeds) {
    recs.push("Apply post-emergent spot treatment in 2 weeks");
  }
  if (recs.length === 0) {
    recs.push(`Continue ${serviceName.toLowerCase()} on current schedule`);
    recs.push("Monitor for activity between service visits");
  }

  // Service performed description
  let performed = "";
  switch (serviceType) {
    case "pest":
      performed = `Performed full ${serviceName.toLowerCase()} service at ${name}'s property. Applied Bifenthrin 7.9F perimeter spray around foundation and entry points. Placed Fipronil gel bait in interior crack-and-crevice areas.`;
      break;
    case "termite":
      performed = `Conducted termite inspection and preventive treatment at ${name}'s property. Applied Termidor SC to soil around foundation perimeter. Treated expansion joints and plumbing penetrations with Altriset.`;
      break;
    case "weed":
      performed = `Applied selective weed control treatment at ${name}'s property. Used Tenacity Herbicide for pre-emergent control and Certainty Turf for active broadleaf weeds.`;
      break;
    case "lawn":
      performed = `Completed lawn care service at ${name}'s property. Applied balanced fertilization treatment and selective herbicide for weed suppression. Inspected turf health and irrigation coverage.`;
      break;
    default:
      performed = `Completed ${serviceName.toLowerCase()} at ${name}'s property.`;
  }

  if (notes) {
    performed += `\n\nTechnician notes: ${notes}`;
  }

  const followUp = hasInfestation || hasMoisture || hasBurrow;
  const timeOnSite = hasInfestation ? 55 : serviceType === "termite" ? 50 : 40;

  return {
    servicePerformed: performed,
    areasServiced: areas.join("\n"),
    issuesFound: issues.join("\n"),
    recommendations: recs.join("\n"),
    followUp,
    timeOnSite,
    products: defaultProductsByService[serviceType] || [],
  };
}

export function TechReports() {
  const { inventory, updateInventory } = useInventory();
  const { addReport } = useReports();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [hasReport, setHasReport] = useState(false);
  const [isCommitted, setIsCommitted] = useState(false);
  const [selectedTech, setSelectedTech] = useState("mike");
  const [selectedService, setSelectedService] = useState("pest");
  const [customer, setCustomer] = useState("");
  const [productsUsed, setProductsUsed] = useState<ProductUsage[]>([]);

  // Report fields
  const [servicePerformed, setServicePerformed] = useState("");
  const [areasServiced, setAreasServiced] = useState("");
  const [issuesFound, setIssuesFound] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [followUpNeeded, setFollowUpNeeded] = useState("no");
  const [customerPresent, setCustomerPresent] = useState("yes");
  const [timeOnSite, setTimeOnSite] = useState("40");

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // In a real app, this would start/stop speech recognition
  };

  const handleGenerateReport = () => {
    const tech = technicianMap[selectedTech];
    const result = generateStructuredReport(
      transcript,
      selectedService,
      customer,
      tech.name
    );

    setServicePerformed(result.servicePerformed);
    setAreasServiced(result.areasServiced);
    setIssuesFound(result.issuesFound);
    setRecommendations(result.recommendations);
    setFollowUpNeeded(result.followUp ? "yes" : "no");
    setTimeOnSite(String(result.timeOnSite));
    setProductsUsed(result.products);
    setHasReport(true);
    setIsCommitted(false);
  };

  const handleCommitReport = () => {
    // Update inventory for each product used
    productsUsed.forEach((product) => {
      if (product.name && product.quantity > 0) {
        updateInventory(product.name, product.quantity);
      }
    });

    // Add report to the system
    const tech = technicianMap[selectedTech];
    addReport({
      id: `report-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      technicianId: tech.id,
      technicianName: tech.name,
      customer: customer || "Customer Name",
      serviceType: serviceTypeMap[selectedService],
      servicePerformed,
      areasServiced,
      issuesFound,
      recommendations,
      followUpNeeded: followUpNeeded === "yes",
      customerPresent: customerPresent === "yes",
      timeOnSite: Number(timeOnSite),
      productsUsed,
      notes: transcript,
    });
    setIsCommitted(true);
  };

  const handleReset = () => {
    setTranscript("");
    setCustomer("");
    setHasReport(false);
    setIsCommitted(false);
    setServicePerformed("");
    setAreasServiced("");
    setIssuesFound("");
    setRecommendations("");
    setFollowUpNeeded("no");
    setCustomerPresent("yes");
    setTimeOnSite("40");
    setProductsUsed([]);
  };

  const handleAddProduct = () => {
    setProductsUsed([...productsUsed, { name: "", quantity: 0 }]);
  };

  const handleRemoveProduct = (index: number) => {
    setProductsUsed(productsUsed.filter((_, i) => i !== index));
  };

  const handleUpdateProduct = (
    index: number,
    field: "name" | "quantity",
    value: string | number
  ) => {
    const updated = [...productsUsed];
    if (field === "name") {
      updated[index].name = value as string;
    } else {
      updated[index].quantity = Number(value);
    }
    setProductsUsed(updated);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">
          Technician Report Generation
        </h1>
        <p className="text-muted-foreground">
          Voice-to-text report generation. Speak or type a field report and AI
          structures it automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Input Form */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">New Report</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="technician">Technician</Label>
              <Select
                defaultValue="mike"
                onValueChange={setSelectedTech}
              >
                <SelectTrigger id="technician">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mike">Mike Sanders</SelectItem>
                  <SelectItem value="jake">Jake Wilson</SelectItem>
                  <SelectItem value="carlos">Carlos Ramirez</SelectItem>
                  <SelectItem value="derek">Derek Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service Type</Label>
              <Select
                defaultValue="pest"
                onValueChange={setSelectedService}
              >
                <SelectTrigger id="service">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pest">Pest Control</SelectItem>
                  <SelectItem value="lawn">Lawn Care</SelectItem>
                  <SelectItem value="termite">Termite Treatment</SelectItem>
                  <SelectItem value="weed">Weed Control</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer">Customer Name</Label>
              <Input
                id="customer"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="Enter customer name..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transcript">Voice Transcript / Field Notes</Label>
              <Textarea
                id="transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Describe what you did at the job site... e.g. 'Treated exterior perimeter, found moisture near AC unit, heavy ant activity along south wall'"
                className="min-h-[200px] resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleVoiceInput}
                className={
                  isListening
                    ? "bg-destructive text-destructive-foreground"
                    : ""
                }
              >
                <Mic className="w-4 h-4 mr-2" />
                {isListening ? "Stop Recording" : "Voice Input"}
              </Button>
              <Button onClick={handleGenerateReport} className="flex-1">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>

            {/* AI callout */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
              <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">AI-Powered Report Generation</p>
                <p className="text-sm text-muted-foreground mt-1">
                  The AI analyzes your field notes to auto-fill the structured
                  report — service details, products used, issues found, and
                  recommendations. You can edit any field before committing.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Side - Structured Report */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Structured Report</h2>
            <div className="flex items-center gap-2">
              {isCommitted && (
                <Badge
                  variant="outline"
                  className="bg-accent/10 text-accent border-accent/20"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Committed
                </Badge>
              )}
              {hasReport && (
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  New
                </Button>
              )}
            </div>
          </div>

          {hasReport ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Service Performed
                </h3>
                <Textarea
                  value={servicePerformed}
                  onChange={(e) => setServicePerformed(e.target.value)}
                  className="min-h-[100px] resize-none"
                  disabled={isCommitted}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Products Used
                  </h3>
                  {!isCommitted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAddProduct}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {productsUsed.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">
                      No products added
                    </p>
                  )}
                  {productsUsed.map((product, index) => {
                    // Check current stock for this product
                    const invItem = inventory.find(
                      (i) => i.name === product.name
                    );
                    const stockWarning =
                      invItem && product.quantity > 0 && invItem.inStock <= invItem.minThreshold;

                    return (
                      <div key={index} className="flex gap-2 items-center">
                        <Select
                          value={product.name}
                          onValueChange={(value) =>
                            handleUpdateProduct(index, "name", value)
                          }
                          disabled={isCommitted}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {inventory.map((item) => (
                              <SelectItem key={item.name} value={item.name}>
                                {item.name} ({item.inStock} {item.unit} in stock)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          value={product.quantity}
                          onChange={(e) =>
                            handleUpdateProduct(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="w-24"
                          placeholder="Qty"
                          min={0}
                          disabled={isCommitted}
                        />
                        {stockWarning && !isCommitted && (
                          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs whitespace-nowrap">
                            Low stock
                          </Badge>
                        )}
                        {!isCommitted && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveProduct(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Areas Serviced
                </h3>
                <Textarea
                  value={areasServiced}
                  onChange={(e) => setAreasServiced(e.target.value)}
                  className="min-h-[80px] resize-none"
                  disabled={isCommitted}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Issues Found
                </h3>
                <Textarea
                  value={issuesFound}
                  onChange={(e) => setIssuesFound(e.target.value)}
                  className="min-h-[60px] resize-none"
                  disabled={isCommitted}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Recommendations
                </h3>
                <Textarea
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  className="min-h-[80px] resize-none"
                  disabled={isCommitted}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <Label htmlFor="followup" className="text-xs">
                    Follow-up Needed
                  </Label>
                  <Select
                    value={followUpNeeded}
                    disabled={isCommitted}
                    onValueChange={setFollowUpNeeded}
                  >
                    <SelectTrigger id="followup" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="custpresent" className="text-xs">
                    Customer Present
                  </Label>
                  <Select
                    value={customerPresent}
                    disabled={isCommitted}
                    onValueChange={setCustomerPresent}
                  >
                    <SelectTrigger id="custpresent" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="time" className="text-xs">
                    Time on Site (min)
                  </Label>
                  <Input
                    id="time"
                    type="number"
                    value={timeOnSite}
                    onChange={(e) => setTimeOnSite(e.target.value)}
                    className="mt-1"
                    disabled={isCommitted}
                  />
                </div>
              </div>

              {!isCommitted && (
                <Button
                  onClick={handleCommitReport}
                  className="w-full"
                  size="lg"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Commit Report to System
                </Button>
              )}

              {isCommitted && (
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <div className="flex items-center gap-2 text-accent">
                    <CheckCircle className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">
                        Report Committed Successfully
                      </p>
                      <p className="text-sm">
                        Inventory updated — {productsUsed.length} product
                        {productsUsed.length !== 1 ? "s" : ""} deducted from
                        stock. Report visible on technician profile.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No report generated yet</p>
                <p className="text-sm mt-1">
                  Fill in the form and click "Generate Report" — the AI will
                  auto-fill the structured fields
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
