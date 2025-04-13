import React, { useState, useEffect, act } from "react";
import Swal from "sweetalert2";

function CreateWarehouseOrder({ onBack }) {
  const [orderID, setOrderID] = useState("");
  const [count, setCount] = useState(1);
  const [orderDate, setOrderDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [clientId, setClientId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const warehouseOrder = {
      orderID: parseInt(orderID),
      count: parseInt(count),
      orderDate,
      deliveryDate,
      clientId: parseInt(clientId),
    };

    try {
      const response = await fetch("/api/warehouseorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(warehouseOrder),
      });

      if (response.ok) {
        Swal.fire("✅ Sukurta", "Sandėlio užsakymas sėkmingai sukurtas", "success");
        setOrderID("");
        setCount(1);
        setOrderDate("");
        setDeliveryDate("");
        setClientId("");
      } else {
        const error = await response.text();
        console.error("Klaida:", error);
        Swal.fire("❌ Klaida", "Nepavyko sukurti sandėlio užsakymo", "error");
      }
    } catch (err) {
      console.error("Klaida:", err);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">📦 Sukurti Warehouse Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Order ID"
          value={orderID}
          onChange={(e) => setOrderID(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          placeholder="Kiekis"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <label className="block">
          Užsakymo data:
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </label>
        <label className="block">
          Pristatymo data:
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </label>
        <input
          type="number"
          placeholder="Kliento ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            💾 Sukurti
          </button>
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            🔙 Atgal
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateWarehouseOrder;
