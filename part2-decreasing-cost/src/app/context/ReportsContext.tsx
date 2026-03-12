import { createContext, useContext, useState, ReactNode } from "react";

export interface CommittedReport {
  id: string;
  date: string;
  technicianId: string;
  technicianName: string;
  customer: string;
  serviceType: string;
  servicePerformed: string;
  productsUsed: Array<{ name: string; quantity: number }>;
  areasServiced: string;
  issuesFound: string;
  recommendations: string;
  followUpNeeded: boolean;
  customerPresent: boolean;
  timeOnSite: number;
  notes: string;
}

interface ReportsContextType {
  reports: CommittedReport[];
  addReport: (report: CommittedReport) => void;
  getReportsByTechnician: (technicianId: string) => CommittedReport[];
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<CommittedReport[]>([]);

  const addReport = (report: CommittedReport) => {
    setReports((prev) => [report, ...prev]);
  };

  const getReportsByTechnician = (technicianId: string) => {
    return reports.filter((report) => report.technicianId === technicianId);
  };

  return (
    <ReportsContext.Provider value={{ reports, addReport, getReportsByTechnician }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error("useReports must be used within a ReportsProvider");
  }
  return context;
}
