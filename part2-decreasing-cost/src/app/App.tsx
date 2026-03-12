import { RouterProvider } from "react-router";
import { router } from "./routes";
import { InventoryProvider } from "./context/InventoryContext";
import { ReportsProvider } from "./context/ReportsContext";
import { RoutesProvider } from "./context/RoutesContext";

export default function App() {
  return (
    <RoutesProvider>
      <InventoryProvider>
        <ReportsProvider>
          <RouterProvider router={router} />
        </ReportsProvider>
      </InventoryProvider>
    </RoutesProvider>
  );
}