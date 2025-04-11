import { useEffect, useState } from "react";

export default function TransportationOrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/transportationorder")
      .then((res) => res.json())
      .then(setOrders)
      .catch((err) => console.error("Klaida:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">⏳ Kraunama...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-gray-500">📭 Užsakymų nėra.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Aprašymas</th>
            <th className="border px-4 py-2">Adresas</th>
            <th className="border px-4 py-2">Būsena</th>
            <th className="border px-4 py-2">Data</th>
            <th className="border px-4 py-2">Rampos</th>
            <th className="border px-4 py-2">Vyksta</th>
            <th className="border px-4 py-2">Įvykdyta</th>
            <th className="border px-4 py-2">Atšaukta</th>
            <th className="border px-4 py-2">Sunkv. numeris</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderID}>
              <td className="border px-4 py-2">{order.orderID}</td>
              <td className="border px-4 py-2">{order.description}</td>
              <td className="border px-4 py-2">{order.address}</td>
              <td className="border px-4 py-2">{order.state}</td>
              <td className="border px-4 py-2">{new Date(order.deliveryTime).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{order.ramp}</td>
              <td className="border px-4 py-2">{order.isOnTheWay ? "✔️" : "❌"}</td>
              <td className="border px-4 py-2">{order.isCompleted ? "✔️" : "❌"}</td>
              <td className="border px-4 py-2">{order.isCancelled ? "✔️" : "❌"}</td>
              <td className="border px-4 py-2">{order.truckPlateNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
