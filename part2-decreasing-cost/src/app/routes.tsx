import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Dashboard } from "./pages/Dashboard";
import { RoutePlanning } from "./pages/RoutePlanning";
import { Scheduling } from "./pages/Scheduling";
import { Inventory } from "./pages/Inventory";
import { TechReports } from "./pages/TechReports";
import { TechnicianProfile } from "./pages/TechnicianProfile";
import { Forecasting } from "./pages/Forecasting";
import { AddLocation } from "./pages/AddLocation";
import { Technicians } from "./pages/Technicians";
import { ClientProfile } from "./pages/ClientProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "route-planning", Component: RoutePlanning },
      { path: "customers", Component: AddLocation },
      { path: "scheduling", Component: Scheduling },
      { path: "inventory", Component: Inventory },
      { path: "reports", Component: TechReports },
      { path: "forecasting", Component: Forecasting },
      { path: "technicians", Component: Technicians },
      { path: "technician/:id", Component: TechnicianProfile },
      { path: "customer/:id", Component: ClientProfile },
    ],
  },
]);