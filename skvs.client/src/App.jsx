import { useState } from "react";
import TransportationOrdersList from "./TransporatationView/TransporataionOrderList";
import CreateTransportationOrder from "./TransporatationView/CreateTransportationOrder";
import CreateWarehouseOrder from "./WareHouseView/CreateWarehouseOrder";
import SelectDriverPage from "./TransporatationView/SelectDriverPage";
import SelectTruckPage from "./TransporatationView/SelectTruckPage";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedTruck, setSelectedTruck] = useState(null);

  const [form, setForm] = useState({
    description: "",
    address: "",
    deliveryTime: "",
    ramp: "",
    state: "Formed",
    createdById: 3,
    warehouseOrderIds: [],
    selectedDriver: null,
    selectedTruck: null,
  });

  const resetForm = () => {
    setForm({
      description: "",
      address: "",
      deliveryTime: "",
      ramp: "",
      state: "Formed",
      createdById: 3,
      warehouseOrderIds: [],
      selectedDriver: null,
      selectedTruck: null,
    });
    setSelectedDriver(null);
    setSelectedTruck(null);
  };

  return (
    <div className="App p-6">
      <h1 className="text-2xl font-bold mb-4">🚚 SKVS Sistema</h1>

      {currentPage === "home" && (
        <TransportationOrdersList onNavigate={setCurrentPage} />
      )}

      {currentPage === "createTransportation" && (
        <CreateTransportationOrder
          form={form}
          setForm={setForm}
          onBack={() => {
            resetForm();
            setCurrentPage("home");
          }}
          onSelectDriver={() => setCurrentPage("selectDriver")}
          onSelectTruck={() => setCurrentPage("selectTruck")}
          onSuccess={() => {
            resetForm();
            setCurrentPage("home");
          }}
        />
      )}

      {currentPage === "createWarehouse" && (
        <CreateWarehouseOrder onBack={() => setCurrentPage("home")} />
      )}

      {currentPage === "selectDriver" && (
        <SelectDriverPage
          onSelect={(driver) => {
            setSelectedDriver(driver);
            setForm((prev) => ({ ...prev, selectedDriver: driver }));
            setCurrentPage("createTransportation");
          }}
          onBack={() => setCurrentPage("createTransportation")}
        />
      )}

      {currentPage === "selectTruck" && (
        <SelectTruckPage
          onSelect={(truck) => {
            setSelectedTruck(truck);
            setForm((prev) => ({ ...prev, selectedTruck: truck }));
            setCurrentPage("createTransportation");
          }}
          onBack={() => setCurrentPage("createTransportation")}
        />
      )}
    </div>
  );
}

export default App;
