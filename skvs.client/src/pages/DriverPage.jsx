import { useEffect, useState } from 'react';
import TransportationOrdersList from '../TransporatationView/TransportationOrderList';
import Swal from 'sweetalert2';

export default function DriverPage() {
	const [orders, setOrders] = useState([]);
	const [drivers, setDrivers] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const driversRes = await fetch('/api/drivers');
				const ordersRes = await fetch('/api/transportationorder');

				if (!driversRes.ok || !ordersRes.ok) throw new Error();

				setDrivers(await driversRes.json());
				setOrders(await ordersRes.json());
			} catch {
				Swal.fire('Klaida', 'Nepavyko užkrauti duomenų', 'error');
			}
		};
		fetchData();
	}, []);

	const handleCancelDeliveryTime = (orderId) => {
		setOrders((prev) =>
			prev.map((order) =>
				order.orderId === orderId ? { ...order, deliveryTime: null, ramp: null, deliveryTimeId: null } : order
			)
		);
	};

	return (
		<TransportationOrdersList
			actor='driver'
			actorId={1}
			actors={drivers}
			orders={orders}
			onCancelDeliveryTime={handleCancelDeliveryTime}
		/>
	);
}
