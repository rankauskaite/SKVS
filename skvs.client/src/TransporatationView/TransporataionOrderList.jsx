import React, { useEffect, useState } from 'react';
import '../TableStyles.css';

const TransportationOrdersList = ({ onNavigate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/transportationorder');
      if (!response.ok) {
        throw new Error(`Klaida: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error('Klaida:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="full-page-center"><p>Kraunama...</p></div>;
  if (error) return <div className="full-page-center"><p>Įvyko klaida: {error}</p></div>;
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
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderID}>
              <td>{order.orderID}</td>
              <td>{order.description}</td>
              <td>{order.address}</td>
              <td>{order.deliveryTime}</td>
              <td>{order.ramp}</td>
              <td>{order.state}</td>
              <td>{order.isOnTheWay ? 'Yes' : 'No'}</td>
              <td>{order.truckPlateNumber}</td>
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
