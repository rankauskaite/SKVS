import { useState, useEffect } from "react";
import Swal from "sweetalert2";

import TransportationOrdersList from "./TransporatationView/TransporataionOrderList";
import TransportationOrderForm from "./TransporatationView/TransportationOrderForm";
import CreateWarehouseOrder from "./WareHouseView/CreateWarehouseOrder";
import SelectDriverPage from "./TransporatationView/SelectDriverPage";
import SelectTruckPage from "./TransporatationView/SelectTruckPage";
import DeliveryTimeManagement from "./TransporatationView/DeliveryTimeManagement";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const [drivers, setDrivers] = useState([]);
=======
import TransportationOrdersList from './TransporatationView/TransporataionOrderList';
import CreateTransportationOrder from './TransporatationView/CreateTransportationOrder';
import CreateWarehouseOrder from './WareHouseView/CreateWarehouseOrder';
import SelectDriverPage from './TransporatationView/SelectDriverPage';
import SelectTruckPage from './TransporatationView/SelectTruckPage';
import SelectDeliveryTimePage from './TransporatationView/SelectDeliveryTimePage';
import WarehouseOrderList from './WareHouseView/WarehouseOrderList'; 
import CheckOrderValidity from './WareHouseView/CheckOrderValidity';

function App() {
	const [currentPage, setCurrentPage] = useState('home');
	const [selectedDriver, setSelectedDriver] = useState(null);
	const [selectedTruck, setSelectedTruck] = useState(null);
	const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(null);
	const [selectedOrderId, setSelectedOrderId] = useState(null);
	const [orders, setOrders] = useState([]);
	const [warehouseOrders, setWarehouseOrders] = useState([]);
	const [selectedWarehouseOrder, setSelectedWarehouseOrder] = useState(null);
>>>>>>> Stashed changes

  useEffect(() => {
    // Pirmiausia užkrauname vairuotojų sąrašą
    const getDrivers = async () => {
      try {
        const res = await fetch("/api/transportationorderform/drivers"); // Užklausa gauti vairuotojų sąrašą
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
    const fullDate = new Date(deliveryTime.date);
    fullDate.setHours(deliveryTime.time?.hours || 0);
    fullDate.setMinutes(deliveryTime.time?.minutes || 0);
=======
	const handleNavigate = (page, extra = null) => {
		if (page === 'selectDeliveryTime') {
			setSelectedOrderId(extra);
		}
		if (page === 'CheckOrderValidity') {
			setSelectedWarehouseOrder(extra);
		}
		setCurrentPage(page);
	};
>>>>>>> Stashed changes

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
        <SelectDeliveryTimePage
          orderId={selectedOrderId}
          onBack={() => {
            setSelectedOrderId(null);
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
