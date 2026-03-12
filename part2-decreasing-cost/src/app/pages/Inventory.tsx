import { KPICard } from "../components/KPICard";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { DollarSign, Package, AlertTriangle, Bug, Sprout, Droplet, Factory, Hammer, Leaf } from "lucide-react";
import { useInventory } from "../context/InventoryContext";

const categoryIcons: Record<string, typeof Bug> = {
  pesticide: Bug,
  termiticide: Factory,
  herbicide: Leaf,
  fertilizer: Sprout,
  fungicide: Droplet,
  insecticide: Bug,
  rodenticide: Bug,
  equipment: Hammer,
  supplies: Package,
  adjuvant: Droplet,
};

export function Inventory() {
  const { inventory } = useInventory();
  
  const totalValue = inventory.reduce((sum, item) => sum + item.value, 0);
  const totalItems = inventory.length;
  const lowStockCount = inventory.filter((item) => item.status === "low").length;

  // Build categories dynamically from inventory
  const categoryMap = new Map<string, { itemCount: number; value: number }>();
  inventory.forEach((item) => {
    const cat = item.category.toLowerCase();
    const existing = categoryMap.get(cat) || { itemCount: 0, value: 0 };
    categoryMap.set(cat, {
      itemCount: existing.itemCount + 1,
      value: existing.value + item.value,
    });
  });
  const categories = Array.from(categoryMap.entries()).map(([name, data]) => ({
    name: name.toUpperCase(),
    icon: categoryIcons[name] || Package,
    itemCount: data.itemCount,
    value: Math.round(data.value),
  }));

  const getStatusColor = (status: "good" | "warning" | "low") => {
    switch (status) {
      case "good":
        return "bg-accent/10 text-accent border-accent/20";
      case "warning":
        return "bg-warning/10 text-warning border-warning/20";
      case "low":
        return "bg-destructive/10 text-destructive border-destructive/20";
    }
  };

  const getStatusLabel = (status: "good" | "warning" | "low") => {
    switch (status) {
      case "good":
        return "Good";
      case "warning":
        return "Warning";
      case "low":
        return "Low";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Inventory Management</h1>
        <p className="text-muted-foreground">
          Track chemical and supply inventory across warehouse and vehicles
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Total Inventory Value"
          value={`$${Math.round(totalValue).toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-primary"
        />
        <KPICard
          title="Items Tracked"
          value={totalItems}
          icon={Package}
          iconColor="text-chart-3"
        />
        <KPICard
          title="Low Stock Alerts"
          value={lowStockCount}
          icon={AlertTriangle}
          iconColor={lowStockCount > 0 ? "text-destructive" : "text-accent"}
        />
      </div>

      {/* Category Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.name} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/5">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      {category.name}
                    </p>
                    <p className="text-lg font-semibold mb-0.5">
                      {category.itemCount} item{category.itemCount !== 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${category.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Inventory Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold">Detailed Inventory</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>In Stock</TableHead>
                <TableHead className="text-right">Min Threshold</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Restocked</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.name} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="capitalize">{item.category}</TableCell>
                  <TableCell>{item.inStock} {item.unit}</TableCell>
                  <TableCell className="text-right">{item.minThreshold}</TableCell>
                  <TableCell className="text-right">${item.unitCost}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ${Math.round(item.value)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {getStatusLabel(item.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.lastRestocked}
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
