import { useState } from "react";
import TransportationOrdersList from "./TransporatationView/TransporataionOrderList";
import CreateTransportationOrder from "./TransporatationView/CreateTransportationOrder";
import CreateWarehouseOrder from "./WareHouseView/CreateWarehouseOrder";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div className="App p-6">
      <h1 className="text-2xl font-bold mb-4">🚚 SKVS Sistema</h1>

      {currentPage === "home" && (
        <TransportationOrdersList onNavigate={setCurrentPage} />
      )}

      {currentPage === "createTransportation" && (
        <CreateTransportationOrder onBack={() => setCurrentPage("home")} />
      )}

      {currentPage === "createWarehouse" && (
        <CreateWarehouseOrder onBack={() => setCurrentPage("home")} />
      )}
    </div>
  );
}

export default App;
