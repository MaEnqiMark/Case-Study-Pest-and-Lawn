import database from "@/data/database.json";

export type Customer = (typeof database.customers)[number];
export type ServiceRecord = (typeof database.serviceHistory)[number];
export type TreatmentPlan = (typeof database.treatmentPlans)[number];
export type Technician = (typeof database.technicians)[number];
export type Service = (typeof database.services)[number];

export function getCustomers() {
  return database.customers;
}

export function getCustomerById(id: string) {
  return database.customers.find((c) => c.id === id);
}

export function getServiceHistory(customerId?: string) {
  if (customerId) {
    return database.serviceHistory.filter((s) => s.customerId === customerId);
  }
  return database.serviceHistory;
}

export function getTreatmentPlans(customerId?: string) {
  if (customerId) {
    return database.treatmentPlans.filter((p) => p.customerId === customerId);
  }
  return database.treatmentPlans;
}

export function getServices() {
  return database.services;
}

export function getCustomerServiceTypes(customerId: string): string[] {
  const history = getServiceHistory(customerId);
  return [...new Set(history.map((s) => s.serviceType))];
}

export function getLawnOnlyCustomers() {
  return database.customers.filter((c) => {
    const types = getCustomerServiceTypes(c.id);
    return types.includes("lawn") && !types.includes("pest");
  });
}

export function getPestOnlyCustomers() {
  return database.customers.filter((c) => {
    const types = getCustomerServiceTypes(c.id);
    return types.includes("pest") && !types.includes("lawn");
  });
}

export function getOneTimeOnlyCustomers() {
  return database.customers.filter((c) => {
    const history = getServiceHistory(c.id);
    return history.length > 0 && history.every((s) => !s.recurring);
  });
}

export function getCustomerLastService(customerId: string) {
  const history = getServiceHistory(customerId);
  if (history.length === 0) return null;
  return history.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
}
