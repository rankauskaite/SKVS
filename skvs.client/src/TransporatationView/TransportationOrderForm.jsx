import { useEffect, useState } from "react";

function CreateTransportationOrder({ form, setForm, onBack, onSuccess }) {
  const [warehouseOrders, setWarehouseOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAvailableWarehouseOrders();
    fetchDrivers();
    fetchTrucks();
  }, []);

  const fetchAvailableWarehouseOrders = async () => {
    try {
      const response = await fetch("/api/warehouseorder/available");
      const data = await response.json();
      setWarehouseOrders(data);
    } catch (error) {
      console.error("Klaida gaunant sandėlio užsakymus:", error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await fetch("/api/driver");
      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error("Klaida gaunant vairuotojus:", error);
    }
  };

  const fetchTrucks = async () => {
    try {
      const response = await fetch("/api/truck");
      const data = await response.json();
      setTrucks(data);
    } catch (error) {
      console.error("Klaida gaunant vilkikus:", error);
    }
  };

  const handleOrderToggle = (orderId) => {
    const isSelected = form.warehouseOrderIds.includes(orderId);
    const updated = isSelected
        ? form.warehouseOrderIds.filter(id => id !== orderId)
        : [...form.warehouseOrderIds, orderId];

    setForm(prev => ({ ...prev, warehouseOrderIds: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.warehouseOrderIds.length === 0) {
      setError("Pasirinkite bent vieną sandėlio užsakymą.");
      return;
    }

    const body = {
      description: form.description,
      address: form.address,
      deliveryTime: form.deliveryTime,
      ramp: parseInt(form.ramp),
      state: form.state,
      isCancelled: false,
      isCompleted: false,
      isOnTheWay: false,
      createdById: form.createdById,
      assignedDriverId: form.selectedDriver?.userId ?? null,
      truckPlateNumber: form.selectedTruck?.plateNumber ?? null,
      warehouseOrderIds: form.warehouseOrderIds,
    };

    try {
      const response = await fetch("/api/transportationorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert("Sukurta sėkmingai!");
        onSuccess();
      } else {
        const errText = await response.text();
        console.error("Klaida:", errText);
        alert("Nepavyko sukurti: " + errText);
      }
    } catch (error) {
      console.error("Klaida:", error);
    }
  };

  return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">➕ Naujas pervežimo užsakymas</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
              placeholder="Aprašymas"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
          />
          <input
              placeholder="Adresas"
              value={form.address}
              onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
          />
          <input
              type="date"
              value={form.deliveryTime}
              onChange={(e) => setForm(prev => ({ ...prev, deliveryTime: e.target.value }))}
          />

          <select
              value={form.state}
              onChange={(e) => setForm(prev => ({ ...prev, state: e.target.value }))}
          >
            <option value="Formed">Sudarytas</option>
            <option value="Planed">Suplanuotas</option>
            <option value="InProgress">Vykdomas</option>
            <option value="Completed">Įvykdytas</option>
            <option value="Cancelled">Atšauktas</option>
          </select>

          {/* Vairuotojas */}
          <div>
            <label className="block font-semibold">👨‍✈️ Pasirink vairuotoją:</label>
            <select
                value={form.selectedDriver?.userId || ""}
                onChange={(e) => {
                  const selected = drivers.find(d => d.userId === e.target.value);
                  setForm(prev => ({ ...prev, selectedDriver: selected || null }));
                }}
                className="mt-1 p-2 border rounded w-full"
            >
              <option value="">-- Pasirinkti vairuotoją --</option>
              {drivers.map(driver => (
                  <option key={driver.userId} value={driver.userId}>
                    {driver.name} {driver.surname}
                  </option>
              ))}
            </select>
          </div>

          {/* Vilkikas */}
          <div>
            <label className="block font-semibold">🚛 Pasirink vilkiką:</label>
            <select
                value={form.selectedTruck?.plateNumber || ""}
                onChange={(e) => {
                  const selected = trucks.find(t => t.plateNumber === e.target.value);
                  setForm(prev => ({ ...prev, selectedTruck: selected || null }));
                }}
                className="mt-1 p-2 border rounded w-full"
            >
              <option value="">-- Pasirinkti vilkiką --</option>
              {trucks.map(truck => (
                  <option key={truck.plateNumber} value={truck.plateNumber}>
                    {truck.plateNumber}
                  </option>
              ))}
            </select>
          </div>

          {/* Sandėlio užsakymai */}
          <div>
            <h3 className="font-semibold">✅ Pasirink sandėlio užsakymus:</h3>
            {warehouseOrders.length === 0 ? (
                <p>Nėra laisvų užsakymų</p>
            ) : (
                warehouseOrders.map((wo) => (
                    <label key={wo.id} className="block">
                      <input
                          type="checkbox"
                          checked={form.warehouseOrderIds.includes(wo.id)}
                          onChange={() => handleOrderToggle(wo.id)}
                      />
                      Užsakymas #{wo.id} – Kiekis: {wo.count}, Klientas ID: {wo.clientId}
                    </label>
                ))
            )}
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex gap-4 mt-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              💾 Sukurti
            </button>
            <button type="button" onClick={onBack} className="bg-gray-400 text-white px-4 py-2 rounded">
              ⬅️ Atgal
            </button>
          </div>
        </form>
      </div>
  );
}

export default CreateTransportationOrder;
