import database from "@/data/database.json";

export type Technician = (typeof database.technicians)[number];
export type Vehicle = (typeof database.vehicles)[number];
export type InventoryItem = (typeof database.inventory)[number];
export type Job = (typeof database.todaysJobs)[number];
export type Customer = (typeof database.customers)[number];
export type ServiceRecord = (typeof database.serviceHistory)[number];
export type Service = (typeof database.services)[number];

export function getTechnicians() {
  return database.technicians;
}

export function getVehicles() {
  return database.vehicles;
}

export function getInventory() {
  return database.inventory;
}

export function getTodaysJobs() {
  return database.todaysJobs;
}

export function getJobsByTechnician(techId: string) {
  return database.todaysJobs.filter((j) => j.assignedTech === techId);
}

export function getLowStockItems() {
  return database.inventory.filter((i) => i.inStock <= i.minThreshold);
}

export function getUnassignedVehicles() {
  return database.vehicles.filter((v) => v.assignedTo === null);
}

export function getVehiclesInMaintenance() {
  return database.vehicles.filter((v) => v.status === "maintenance");
}

export function getCustomers() {
  return database.customers;
}

export function getServiceHistory(customerId?: string) {
  if (customerId) {
    return database.serviceHistory.filter((s) => s.customerId === customerId);
  }
  return database.serviceHistory;
}

export function getServices() {
  return database.services;
}
