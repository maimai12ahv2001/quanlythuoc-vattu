import { useState } from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Inventory } from "./components/Inventory";
import { ExpiryTracking } from "./components/ExpiryTracking";
import { SmartOrdering } from "./components/SmartOrdering";

export default function App() {
  /* MARKER-MAKE-KIT-INVOKED */
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "inventory": return <Inventory />;
      case "expiry": return <ExpiryTracking />;
      case "ordering": return <SmartOrdering />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activePage={page} onNavigate={setPage}>
      {renderPage()}
    </Layout>
  );
}
