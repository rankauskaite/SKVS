import { useEffect, useState } from "react";

function CreateTransportationOrder({ form, setForm, onBack, onSelectDriver, onSelectTruck, onSuccess }) {
  const [warehouseOrders, setWarehouseOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAvailableWarehouseOrders();
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
      <h2 className="text-xl font-bold mb-4">➕ Naujas Transportation Order</h2>
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
        <input
          type="number"
          placeholder="Rampos numeris"
          value={form.ramp}
          onChange={(e) => setForm(prev => ({ ...prev, ramp: e.target.value }))}
        />

        <select
          value={form.state}
          onChange={(e) => setForm(prev => ({ ...prev, state: e.target.value }))}
        >
          <option value="Formed">Formed</option>
          <option value="InProgress">InProgress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <div>
          <label className="block font-semibold">👨‍✈️ Pasirinktas vairuotojas:</label>
          {form.selectedDriver ? (
            <div className="bg-gray-100 p-2 rounded">
              {form.selectedDriver.name} {form.selectedDriver.surname}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nepasirinktas</p>
          )}
          <button
            type="button"
            onClick={onSelectDriver}
            className="bg-blue-500 text-white px-4 py-1 mt-2 rounded"
          >
            Pasirinkti vairuotoją
          </button>
        </div>

        <div>
          <label className="block font-semibold">🚛 Pasirinktas vilkikas:</label>
          {form.selectedTruck ? (
            <div className="bg-gray-100 p-2 rounded">
              {form.selectedTruck.plateNumber}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nepasirinktas</p>
          )}
          <button
            type="button"
            onClick={onSelectTruck}
            className="bg-blue-500 text-white px-4 py-1 mt-2 rounded"
          >
            Pasirinkti vilkiką
          </button>
        </div>

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
