import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

import TransportationOrdersList from './TransporatationView/TransporataionOrderList';
import CreateTransportationOrder from './TransporatationView/CreateTransportationOrder';
import CreateWarehouseOrder from './WareHouseView/CreateWarehouseOrder';
import SelectDriverPage from './TransporatationView/SelectDriverPage';
import SelectTruckPage from './TransporatationView/SelectTruckPage';
import SelectDeliveryTimePage from './TransporatationView/SelectDeliveryTimePage';
import WarehouseOrderList from './WareHouseView/WarehouseOrderList'; // Corrected import

function App() {
	const [currentPage, setCurrentPage] = useState('home');
	const [selectedDriver, setSelectedDriver] = useState(null);
	const [selectedTruck, setSelectedTruck] = useState(null);
	const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(null);
	const [selectedOrderId, setSelectedOrderId] = useState(null);
	const [orders, setOrders] = useState([]);
	const [warehouseOrders, setWarehouseOrders] = useState([]);

	const [form, setForm] = useState({
		description: '',
		address: '',
		deliveryTime: '',
		ramp: '',
		state: 'Formed',
		createdById: 3,
		warehouseOrderIds: [],
		selectedDriver: null,
		selectedTruck: null,
		selectedDeliveryTime: null,
	});

	// Fetch all orders on initial load
	useEffect(() => {
		fetchOrders();
		fetchWarehouseOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			const res = await fetch('/api/transportationorder');
			if (!res.ok) throw new Error('Nepavyko gauti užsakymų');
			const data = await res.json();
			setOrders(data);
		} catch (err) {
			console.error('❌ Klaida gaunant užsakymus:', err);
			Swal.fire('Klaida', 'Nepavyko užkrauti užsakymų', 'error');
		}
	};

	const fetchWarehouseOrders = async () => {
		try {
			const res = await fetch('/api/warehouseorder');
			if (!res.ok) throw new Error('Nepavyko gauti sandėlio užsakymų');
			const data = await res.json();
			setWarehouseOrders(data);
		} catch (err) {
			console.error('❌ Klaida gaunant sandėlio užsakymus:', err);
			Swal.fire('Klaida', 'Nepavyko užkrauti sandėlio užsakymų', 'error');
		}
	};

	const resetForm = () => {
		setForm({
			description: '',
			address: '',
			deliveryTime: '',
			ramp: '',
			state: 'Formed',
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
		if (page === 'selectDeliveryTime') {
			setSelectedOrderId(extra);
		}
		setCurrentPage(page);
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
							deliveryTime: fullDate.toISOString(), // ISO string, so it works with new Date(...)
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

	return (
		<div className='App p-6'>
			<h1 className='text-2xl font-bold mb-4'>🚚 SKVS Sistema</h1>

			{currentPage === 'home' && (
				<TransportationOrdersList
					onNavigate={handleNavigate}
					orders={orders}
					setOrders={setOrders}
					onCancelDeliveryTime={handleCancelDeliveryTime}
				/>
			)}

			{currentPage === 'createTransportation' && (
				<CreateTransportationOrder
					form={form}
					setForm={setForm}
					onBack={() => {
						resetForm();
						setCurrentPage('home');
					}}
					onSelectDriver={() => setCurrentPage('selectDriver')}
					onSelectTruck={() => setCurrentPage('selectTruck')}
					onSelectDeliveryTime={() => setCurrentPage('selectDeliveryTime')}
					onSuccess={() => {
						resetForm();
						setCurrentPage('home');
						fetchOrders(); // Refresh the list of orders
					}}
				/>
			)}

			{currentPage === 'createWarehouse' && <CreateWarehouseOrder onBack={() => setCurrentPage('home')} />}

			{currentPage === 'selectDriver' && (
				<SelectDriverPage
					onSelect={(driver) => {
						setSelectedDriver(driver);
						setForm((prev) => ({ ...prev, selectedDriver: driver }));
						setCurrentPage('createTransportation');
					}}
					onBack={() => setCurrentPage('createTransportation')}
				/>
			)}

			{currentPage === 'selectTruck' && (
				<SelectTruckPage
					onSelect={(truck) => {
						setSelectedTruck(truck);
						setForm((prev) => ({ ...prev, selectedTruck: truck }));
						setCurrentPage('createTransportation');
					}}
					onBack={() => setCurrentPage('createTransportation')}
				/>
			)}

			{currentPage === 'selectDeliveryTime' && selectedOrderId && (
				<SelectDeliveryTimePage
					orderId={selectedOrderId}
					onSelect={(deliveryTime) => {
						setSelectedDeliveryTime(deliveryTime);
						setForm((prev) => ({
							...prev,
							selectedDeliveryTime: deliveryTime,
						}));
					}}
					onBack={() => {
						setSelectedOrderId(null);
						setCurrentPage('home');
					}}
					onSuccess={(deliveryTime) => {
						handleDeliveryTimeUpdate(selectedOrderId, deliveryTime);
						setSelectedOrderId(null);
						setCurrentPage('home');

						Swal.fire({
							title: '✅ Laikas priskirtas!',
							html: `
                <p><strong>Data:</strong> ${new Date(deliveryTime.date).toLocaleDateString()}</p>
                <p><strong>Laikas:</strong> ${String(deliveryTime.time?.hours).padStart(2, '0')}:${String(
								deliveryTime.time?.minutes
							).padStart(2, '0')}</p>
                <p><strong>Ramp:</strong> ${deliveryTime.ramp}</p>
              `,
							icon: 'success',
							timer: 3000,
							showConfirmButton: false,
						});
					}}
				/>
			)}

			{currentPage === 'WarehouseOrderList' && (
				<WarehouseOrderList
					onNavigate={handleNavigate}
					warehouseOrders={warehouseOrders}
					setWarehouseOrders={setWarehouseOrders}
					onBack={() => {
						setCurrentPage('home');
					}}
				/>
			)}
		</div>
	);
}

export default App;
