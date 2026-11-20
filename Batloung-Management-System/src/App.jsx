
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Suppliers from "./pages/Suppliers";
import Vendors from "./pages/Vendors";
import Fruits from "./pages/Fruits";
import StockManagement from "./pages/StockManagement";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const pages = {
    Dashboard: <Dashboard />,
    Suppliers: <Suppliers />,
    Vendors: <Vendors />,
    Fruits: <Fruits />,
    "Stock Management": <StockManagement />,
    Purchases: <Purchases />,
    Sales: <Sales />,
    Reports: <Reports />
  };

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">
        <Header activePage={activePage} />

        <div className="content-area">
          {pages[activePage]}
        </div>
      </main>
    </div>
  );
}

export default App;
