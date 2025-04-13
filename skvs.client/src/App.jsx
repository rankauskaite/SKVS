import { useState, useEffect } from "react";
import Swal from "sweetalert2";

import TransportationOrdersList from "./TransporatationView/TransportationOrderList.jsx";
import TransportationOrderForm from "./TransporatationView/TransportationOrderForm";
import WarehouseOrderForm from "./WareHouseView/WarehouseOrderForm";
import WarehouseOrderList from "./WareHouseView/WarehouseOrderList";
import SelectDriverPage from "./TransporatationView/SelectDriverPage";
import SelectTruckPage from "./TransporatationView/SelectTruckPage";
import DeliveryTimeManagement from "./TransporatationView/DeliveryTimeManagement";
import WarehouseOrder from "./WareHouseView/WarehouseOrder";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [selectedWarehouseOrder, setSelectedWarehouseOrder] = useState(null);

  useEffect(() => {
    // Pirmiausia užkrauname vairuotojų sąrašą
    const getDrivers = async () => {
      try {
        const res = await fetch("/api/drivers");
        if (!res.ok) throw new Error("Nepavyko gauti vairuotojų");
        const data = await res.json();
        setDrivers(data); // Įrašome vairuotojus į state
      } catch (err) {
        console.error("❌ Klaida gaunant vairuotojus:", err);
        Swal.fire("Klaida", "Nepavyko užkrauti vairuotojų", "error");
      }
    };

    getDrivers();
  }, []);

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
    drivers: [], // Pridedame, kad saugotume API gautus duomenis
    trucks: [],
    warehouseOrders: [],
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
      selectedDeliveryTime: null,
      drivers: [],
      trucks: [],
      warehouseOrders: [],
    });
    setSelectedDriver(null);
    setSelectedTruck(null);
    setSelectedDeliveryTime(null);
  };

  const retrieveForm = async () => {
    try {
      // Gauname vairuotojus
      const driversRes = await fetch("/api/drivers");
      if (!driversRes.ok) throw new Error("Nepavyko gauti vairuotojų");
      const driversData = await driversRes.json();

      // Gauname vilkikus
      const trucksRes = await fetch("/api/trucks");
      if (!trucksRes.ok) throw new Error("Nepavyko gauti vilkikų");
      const trucksData = await trucksRes.json();

      // Gauname sandėlio užsakymus
      const warehouseOrdersRes = await fetch("/api/available/warehouseOrders");
      if (!warehouseOrdersRes.ok)
        throw new Error("Nepavyko gauti sandėlio užsakymų");
      const warehouseOrdersData = await warehouseOrdersRes.json();

      return {
        drivers: driversData,
        trucks: trucksData,
        warehouseOrders: warehouseOrdersData,
      };
    } catch (err) {
      console.error("❌ Klaida gaunant formos duomenis:", err);
      Swal.fire("Klaida", "Nepavyko užkrauti formos duomenų", "error");
      return null;
    }
  };

  const provideForm = (formData) => {
    if (formData) {
      setForm((prev) => ({
        ...prev,
        drivers: formData.drivers,
        trucks: formData.trucks,
        warehouseOrders: formData.warehouseOrders,
      }));
      setCurrentPage("createTransportation");
    }
  };

  const handleNavigate = (page, extra = null) => {
    if (page === "selectDeliveryTime") {
        setSelectedOrderId(extra);
        setCurrentPage(page);
    }
    if (page === 'CheckOrderValidity') {
        setSelectedWarehouseOrder(extra);
        setCurrentPage(page);
    }
    if (page === "createTransportation") {
        retrieveForm().then((formData) => {
            if (formData) {
                provideForm(formData);
            }
        });
    } else {
        setCurrentPage(page);
    }
  };

  const handleDeliveryTimeUpdate = (orderId, deliveryTime) => {
    const fullDate = new Date(deliveryTime.date);
    fullDate.setHours(deliveryTime.time?.hours || 0);
    fullDate.setMinutes(deliveryTime.time?.minutes || 0);

    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              deliveryTime: fullDate.toISOString(), // ISO string, kad veiktų new Date(...)
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

  const [orderDate, setOrderDate] = useState(null);

  useEffect(() => {
    if (selectedOrderId) {
      fetch(`/api/transportationorder/${selectedOrderId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Nepavyko gauti užsakymo");
          return res.json();
        })
        .then((data) => {
          setOrderDate(data.deliveryTime);  // Tarkime, kad 'deliveryTime' yra užsakymo data
        })
        .catch((err) => {
          console.error("Klaida gaunant užsakymą:", err);
        });
    }
  }, [selectedOrderId]);  // Stebi 'selectedOrderId'

  // Funkcija, kuri atnaujina pasirinkto vairuotojo ID
  const handleDriverChange = (e) => {
    const selectedDriverId = e.target.value;  // Imame pasirinkto vairuotojo userId
    setDriverId(selectedDriverId ? selectedDriverId : null);
  };

  return (
    <div className="App p-6">
      <h1 className="text-2xl font-bold mb-4">🚚 SKVS Sistema</h1>

      {/* Add the 3 buttons */}
      <div className="mb-4">
        <button
          className="mr-2 p-2 bg-blue-500 text-white rounded"
          onClick={() => setCurrentPage("driver")}
        >
          Vairuotojas
        </button>
        <button
          className="mr-2 p-2 bg-blue-500 text-white rounded"
          onClick={() => setCurrentPage("truckCompany")}
        >
          Sunkvežimių įmonė
        </button>
        <button
          className="mr-2 p-2 bg-blue-500 text-white rounded"
          onClick={() => setCurrentPage("SVS")}
        >
          SVS
        </button>
      </div>

      {/* Render the corresponding page based on selected page */}
      {currentPage === "driver" && (
        <TransportationOrdersList
          onNavigate={handleNavigate}
          actor={currentPage}
          actorId={1}
          actors={drivers}
          onCancelDeliveryTime={handleCancelDeliveryTime}
        />
      )}

      {currentPage === "truckCompany" && (
        <TransportationOrdersList
          onNavigate={handleNavigate}
          actor={currentPage}
          actorId={1}
          actors={drivers}
          onCancelDeliveryTime={handleCancelDeliveryTime}
        />
      )}

      {currentPage === "SVS" && (
        <WarehouseOrderList
          onNavigate={handleNavigate}
          setWarehouseOrders={() => {}}
          onBack={() => {
            resetForm();
            setCurrentPage("home");
          }}
        />
      )}

      {currentPage === "createTransportation" && (
        <TransportationOrderForm
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
            fetchOrders(); // atnaujinti sąrašą
          }}
        />
      )}

      {currentPage === "createWarehouse" && (
        <WarehouseOrderForm onBack={() => setCurrentPage("home")} />
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

      {currentPage === "CheckOrderValidity" && selectedWarehouseOrder && (
        <WarehouseOrder
          order={selectedWarehouseOrder}
          onBack={() => {
            setSelectedWarehouseOrder(null);
            setCurrentPage("SVS");
          }}
        />
      )}

      {currentPage === "selectDeliveryTime" && selectedOrderId && (
        <DeliveryTimeManagement
          orderId={selectedOrderId}
          orderDate={orderDate}
          onSelect={(deliveryTime) => {
            setSelectedDeliveryTime(deliveryTime);
            setForm((prev) => ({
              ...prev,
              selectedDeliveryTime: deliveryTime,
            }));
          }}
          onBack={() => {
            setSelectedOrderId(null);
            setCurrentPage("driver");
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
