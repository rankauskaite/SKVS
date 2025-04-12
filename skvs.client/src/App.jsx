import { useState, useEffect } from "react";
import Swal from "sweetalert2";

import TransportationOrdersList from "./TransporatationView/TransporataionOrderList";
import CreateTransportationOrder from "./TransporatationView/CreateTransportationOrder";
import CreateWarehouseOrder from "./WareHouseView/CreateWarehouseOrder";
import SelectDriverPage from "./TransporatationView/SelectDriverPage";
import SelectTruckPage from "./TransporatationView/SelectTruckPage";
import SelectDeliveryTimePage from "./TransporatationView/SelectDeliveryTimePage";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orders, setOrders] = useState([]);

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
    selectedDeliveryTime: null,
  });

  // ⏬ UŽKRAUTI UŽSAKYMUS IŠ SERVERIO
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/transportationorder");
      if (!res.ok) throw new Error("Nepavyko gauti užsakymų");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("❌ Klaida gaunant užsakymus:", err);
      Swal.fire("Klaida", "Nepavyko užkrauti užsakymų", "error");
    }
  };

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
      selectedDeliveryTime: null,
    });
    setSelectedDriver(null);
    setSelectedTruck(null);
    setSelectedDeliveryTime(null);
  };

  const handleNavigate = (page, extra = null) => {
    if (page === "selectDeliveryTime") {
      setSelectedOrderId(extra);
    }
    setCurrentPage(page);
  };

  const handleDeliveryTimeUpdate = (orderId, deliveryTime) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              deliveryTime: `${deliveryTime.date}T${String(deliveryTime.time?.hours).padStart(2, "0")}:${String(deliveryTime.time?.minutes).padStart(2, "0")}`,
              ramp: deliveryTime.ramp,
              deliveryTimeId: deliveryTime.id,
            }
          : order
      )
    );
  };

  const handleCancelDeliveryTime = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              deliveryTime: null,
              ramp: null,
              deliveryTimeId: null,
            }
          : order
      )
    );
  };

  return (
    <div className="App p-6">
      <h1 className="text-2xl font-bold mb-4">🚚 SKVS Sistema</h1>

      {currentPage === "home" && (
        <TransportationOrdersList
          onNavigate={handleNavigate}
          orders={orders}
          setOrders={setOrders}
          onCancelDeliveryTime={handleCancelDeliveryTime}
        />
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
          onSelectDeliveryTime={() => setCurrentPage("selectDeliveryTime")}
          onSuccess={() => {
            resetForm();
            setCurrentPage("home");
            fetchOrders(); // refreshinam po naujo užsakymo
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

      {currentPage === "selectDeliveryTime" && selectedOrderId && (
        <SelectDeliveryTimePage
          orderId={selectedOrderId}
          onSelect={(deliveryTime) => {
            setSelectedDeliveryTime(deliveryTime);
            setForm((prev) => ({
              ...prev,
              selectedDeliveryTime: deliveryTime,
            }));
          }}
          onBack={() => {
            setSelectedOrderId(null);
            setCurrentPage("home");
          }}
          onSuccess={(deliveryTime) => {
            handleDeliveryTimeUpdate(selectedOrderId, deliveryTime);
            setSelectedOrderId(null);
            setCurrentPage("home");

            Swal.fire({
              title: "✅ Laikas priskirtas!",
              html: `
                <p><strong>Data:</strong> ${new Date(deliveryTime.date).toLocaleDateString()}</p>
                <p><strong>Laikas:</strong> ${String(deliveryTime.time?.hours).padStart(2, "0")}:${String(deliveryTime.time?.minutes).padStart(2, "0")}</p>
                <p><strong>Ramp:</strong> ${deliveryTime.ramp}</p>
              `,
              icon: "success",
              timer: 3000,
              showConfirmButton: false,
            });
          }}
        />
      )}
    </div>
  );
}

export default App;
