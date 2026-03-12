import { createContext, useContext, useState, ReactNode } from "react";

export interface InventoryItem {
  name: string;
  category: string;
  inStock: number;
  unit: string;
  minThreshold: number;
  unitCost: number;
  value: number;
  status: "good" | "warning" | "low";
  lastRestocked: string;
}

interface InventoryContextType {
  inventory: InventoryItem[];
  updateInventory: (productName: string, quantity: number) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const initialInventory: InventoryItem[] = [
  {
    name: "Bifenthrin 7.9F",
    category: "pesticide",
    inStock: 18,
    unit: "gallon",
    minThreshold: 10,
    unitCost: 45,
    value: 810,
    status: "good",
    lastRestocked: "2024-01-05",
  },
  {
    name: "Fipronil Gel Bait",
    category: "pesticide",
    inStock: 42,
    unit: "tube",
    minThreshold: 20,
    unitCost: 12,
    value: 504,
    status: "good",
    lastRestocked: "2024-01-10",
  },
  {
    name: "Termidor SC",
    category: "termiticide",
    inStock: 6,
    unit: "bottle (78oz)",
    minThreshold: 4,
    unitCost: 95,
    value: 570,
    status: "warning",
    lastRestocked: "2023-12-15",
  },
  {
    name: "Altriset",
    category: "termiticide",
    inStock: 8,
    unit: "jug (1gal)",
    minThreshold: 3,
    unitCost: 105,
    value: 840,
    status: "good",
    lastRestocked: "2024-01-08",
  },
  {
    name: "Tenacity Herbicide",
    category: "herbicide",
    inStock: 12,
    unit: "bottle (8oz)",
    minThreshold: 6,
    unitCost: 48,
    value: 576,
    status: "good",
    lastRestocked: "2024-01-12",
  },
  {
    name: "Certainty Turf",
    category: "herbicide",
    inStock: 23,
    unit: "packet",
    minThreshold: 15,
    unitCost: 24,
    value: 552,
    status: "good",
    lastRestocked: "2024-01-15",
  },
];

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);

  const updateInventory = (productName: string, quantity: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.name === productName) {
          const newStock = Math.max(0, item.inStock - quantity);
          const newValue = newStock * item.unitCost;
          let newStatus: "good" | "warning" | "low" = "good";
          
          if (newStock <= item.minThreshold * 0.5) {
            newStatus = "low";
          } else if (newStock <= item.minThreshold) {
            newStatus = "warning";
          }

          return {
            ...item,
            inStock: newStock,
            value: newValue,
            status: newStatus,
          };
        }
        return item;
      })
    );
  };

  return (
    <InventoryContext.Provider value={{ inventory, updateInventory }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
