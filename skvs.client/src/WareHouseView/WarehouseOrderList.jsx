import React from "react";
import Swal from "sweetalert2";
import "../TableStyles.css";

const WarehouseOrderList = ({ onNavigate, orders, setOrders }) => {
    const handleCancel = async (orderId) => {
        const confirm = await Swal.fire({
            title: "Ar tikrai norite atšaukti užsakymą?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Taip",
            cancelButtonText: "Ne",
        });

        if (confirm.isConfirmed) {
            const res = await fetch(`/api/warehouseorder/${orderId}/cancel`, {
                method: "PUT",
            });

            if (res.ok) {
                Swal.fire("✅ Atšaukta", "Užsakymas sėkmingai atšauktas", "success");

                // Atšaukus išvalom užsakymą lokaliai
                setOrders((prev) =>
                    prev.filter((order) => order.id !== orderId)
                );
            } else {
                Swal.fire("❌ Klaida", "Nepavyko atšaukti užsakymo", "error");
            }
        }
    };

    if (orders.length === 0) {
        return (
            <div className="full-page-center">
                <p>Nėra jokių užsakymų.</p>
            </div>
        );
    }

    return (
        <div className="full-page-center">
            <h2 className="table-title">Warehouse Orders</h2>
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Client</th>
                        <th>Order Date</th>
                        <th>Delivery Date</th>
                        <th>Count</th>
                        <th>Transportation Order ID</th>
                        <th>Veiksmai</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.orderID}</td>
                            <td>{order.clientId}</td>
                            <td>{new Date(order.orderDate).toLocaleString()}</td>
                            <td>{new Date(order.deliveryDate).toLocaleString()}</td>
                            <td>{order.count}</td>
                            <td>{order.transportationOrderID ?? '-'}</td>
                            <td className="flex flex-col gap-2">
                                <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                                    onClick={() => onNavigate("editWarehouseOrder", order.id)}
                                >
                                    ✏️ Keisti užsakymą
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                                    onClick={() => handleCancel(order.id)}
                                >
                                    ❌ Atšaukti užsakymą
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 flex gap-4">
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => onNavigate("createWarehouse")}
                >
                    📦 Naujas Warehouse Order
                </button>
            </div>
        </div>
    );
};

export default WarehouseOrderList;
