import React from "react";
import Swal from "sweetalert2";
import "../TableStyles.css";

const TransportationOrdersList = ({ onNavigate, orders, setOrders }) => {
  const handleCancel = async (orderId) => {
    const confirm = await Swal.fire({
      title: "Ar tikrai norite atšaukti rezervaciją?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Taip",
      cancelButtonText: "Ne",
    });

    if (confirm.isConfirmed) {
      const res = await fetch(`/api/transportationorder/${orderId}/cancelDeliveryTime`, {
        method: "PUT",
      });

      if (res.ok) {
        Swal.fire("✅ Atšaukta", "Rezervacija sėkmingai atšaukta", "success");

        // Atšaukus išvalom laiką lokaliai
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId
              ? { ...order, deliveryTime: null, ramp: null }
              : order
          )
        );
      } else {
        Swal.fire("❌ Klaida", "Nepavyko atšaukti rezervacijos", "error");
      }
    }
  };

  if (orders.length === 0) return <div className="full-page-center"><p>Nėra jokių užsakymų.</p></div>;

  return (
    <div className="full-page-center">
      <h2 className="table-title">Transportation Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Description</th>
            <th>Address</th>
            <th>Delivery Time</th>
            <th>Ramp</th>
            <th>State</th>
            <th>Is On The Way</th>
            <th>Truck Plate</th>
            <th>Veiksmai</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.description}</td>
              <td>{order.address}</td>
              <td>{order.deliveryTime ? new Date(order.deliveryTime).toLocaleString() : 'Nepaskirtas'}</td>
              <td>{order.ramp ?? '-'}</td>
              <td>{order.state}</td>
              <td>{order.isOnTheWay ? 'Taip' : 'Ne'}</td>
              <td>{order.truckPlateNumber || '-'}</td>
              <td className="flex flex-col gap-2">
                {!order.deliveryTime ? (
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                    onClick={() => onNavigate("selectDeliveryTime", order.orderId)}
                  >
                    🕒 Priskirti laiką
                  </button>
                ) : (
                  <>
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                      onClick={() => onNavigate("selectDeliveryTime", order.orderId)}
                    >
                      ✏️ Keisti laiką
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                      onClick={() => handleCancel(order.orderId)}
                    >
                      ❌ Atšaukti laiką
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => onNavigate("createTransportation")}
        >
          ➕ Naujas Transportation Order
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => onNavigate("createWarehouse")}
        >
          📦 Naujas Warehouse Order
        </button>
      </div>
    </div>
  );
};

export default TransportationOrdersList;
