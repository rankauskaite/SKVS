import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

import TransportationOrdersList from './TransporatationView/TransportationOrderList.jsx';
import TransportationOrderForm from './TransporatationView/TransportationOrderForm.jsx';
import WarehouseOrderForm from './WareHouseView/WarehouseOrderForm.jsx';
import WarehouseOrderList from './WareHouseView/WarehouseOrderList.jsx';
import DeliveryTimeManagement from './TransporatationView/DeliveryTimeManagement.jsx';
import WarehouseOrder from './WareHouseView/WarehouseOrder.jsx';

function OldPage() {
	// Būsenos
	const [currentPage, setCurrentPage] = useState('home');
	const [selectedOrderId, setSelectedOrderId] = useState(null);
	const [drivers, setDrivers] = useState([]);
	const [selectedWarehouseOrder, setSelectedWarehouseOrder] = useState(null);
	const [orders, setOrders] = useState([]);
	const [orderDate, setOrderDate] = useState(null);

	// Forma pervežimo užsakymui
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
		drivers: [],
		trucks: [],
		warehouseOrders: [],
	});

	// 20. initiateTransportationOrdersView()
	const initiateTransportationOrdersView = async () => {
		try {
			const response = await fetch('/api/transportationorder');
			if (!response.ok) throw new Error('Nepavyko gauti užsakymų');
			const data = await response.json();
			setOrders(data); // 21. show()
		} catch (err) {
			console.error('❌ Klaida gaunant užsakymus:', err);
			// 22. error()
			Swal.fire('Klaida', 'Nepavyko užkrauti užsakymų', 'error');
		}
	};

	// Vairuotojų ir užsakymų gavimas įkeliant puslapį
	useEffect(() => {
		const getDrivers = async () => {
			try {
				const res = await fetch('/api/drivers');
				if (!res.ok) throw new Error('Nepavyko gauti vairuotojų');
				const data = await res.json();
				setDrivers(data);
			} catch (err) {
				console.error('❌ Klaida gaunant vairuotojus:', err);
				Swal.fire('Klaida', 'Nepavyko užkrauti vairuotojų', 'error');
			}
		};

		getDrivers();
		initiateTransportationOrdersView();
	}, []);

	// Formos atstatymas
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
			drivers: [],
			trucks: [],
			warehouseOrders: [],
		});
	};

	// 2. retrieveForm()
	const retrieveForm = async () => {
		try {
			const driversRes = await fetch('/api/drivers');
			if (!driversRes.ok) throw new Error('Nepavyko gauti vairuotojų');
			const driversData = await driversRes.json();

			const trucksRes = await fetch('/api/trucks');
			if (!trucksRes.ok) throw new Error('Nepavyko gauti vilkikų');
			const trucksData = await trucksRes.json();

			const warehouseOrdersRes = await fetch('/api/available/warehouseOrders');
			if (!warehouseOrdersRes.ok) throw new Error('Nepavyko gauti sandėlio užsakymų');
			const warehouseOrdersData = await warehouseOrdersRes.json();

			return {
				drivers: driversData,
				trucks: trucksData,
				warehouseOrders: warehouseOrdersData,
			};
		} catch (err) {
			console.error('❌ Klaida gaunant formos duomenis:', err);
			Swal.fire('Klaida', 'Nepavyko užkrauti formos duomenų', 'error');
			return null;
		}
	};

	// 9. provideForm()
	const provideForm = (formData) => {
		if (formData) {
			setForm((prev) => ({
				...prev,
				drivers: formData.drivers,
				trucks: formData.trucks,
				warehouseOrders: formData.warehouseOrders,
			}));
			setCurrentPage('createTransportation');
		}
	};

	// 1. initiateTransportationOrderCreation()
	const initiateTransportationOrderCreation = () => {
		retrieveForm().then((formData) => {
			if (formData) {
				provideForm(formData);
			}
		});
	};

	// Navigacijos valdymas
	const handleNavigate = (page, extra = null) => {
		if (page === 'selectDeliveryTime') {
			setSelectedOrderId(extra);
			setCurrentPage(page);
		}
		if (page === 'CheckOrderValidity') {
			setSelectedWarehouseOrder(extra);
			setCurrentPage(page);
		}
		if (page === 'createTransportation') {
			initiateTransportationOrderCreation();
		} else {
			setCurrentPage(page);
		}
	};

	// Pristatymo laiko atnaujinimas
	const handleDeliveryTimeUpdate = (orderId, deliveryTime) => {
		const fullDate = new Date(deliveryTime.date);
		fullDate.setHours(deliveryTime.time?.hours || 0);
		fullDate.setMinutes(deliveryTime.time?.minutes || 0);

		setOrders((prev) =>
			prev.map((order) =>
				order.orderId === orderId
					? {
							...order,
							deliveryTime: fullDate.toISOString(),
							ramp: deliveryTime.ramp,
							deliveryTimeId: deliveryTime.id,
					  }
					: order
			)
		);
	};

	// Pristatymo laiko atšaukimas
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

	// Užsakymo datos gavimas
	useEffect(() => {
		if (selectedOrderId) {
			fetch(`/api/transportationorder/${selectedOrderId}`)
				.then((res) => {
					if (!res.ok) throw new Error('Nepavyko gauti užsakymo');
					return res.json();
				})
				.then((data) => {
					setOrderDate(data.deliveryTime);
				})
				.catch((err) => {
					console.error('Klaida gaunant užsakymą:', err);
				});
		}
	}, [selectedOrderId]);

	// Vairuotojo pasirinkimo valdymas
	const handleDriverChange = (e) => {
		const selectedDriverId = e.target.value;
		setDriverId(selectedDriverId ? selectedDriverId : null);
	};

	return (
		<div className='App p-6'>
			<h1 className='text-2xl font-bold mb-4'>🚚 SKVS Sistema</h1>

			{/* Mygtukai */}
			<div className='mb-4'>
				<button className='mr-2 p-2 bg-blue-500 text-white rounded' onClick={() => setCurrentPage('driver')}>
					Vairuotojas
				</button>
				<button className='mr-2 p-2 bg-blue-500 text-white rounded' onClick={() => setCurrentPage('truckCompany')}>
					Sunkvežimių įmonė
				</button>
				<button className='mr-2 p-2 bg-blue-500 text-white rounded' onClick={() => setCurrentPage('SVS')}>
					SVS
				</button>
			</div>

			{/* Puslapių atvaizdavimas */}
			{currentPage === 'driver' && (
				<TransportationOrdersList
					onNavigate={handleNavigate}
					actor={currentPage}
					actorId={1}
					actors={drivers}
					orders={orders}
					onCancelDeliveryTime={handleCancelDeliveryTime}
				/>
			)}

			{currentPage === 'truckCompany' && (
				<TransportationOrdersList
					onNavigate={handleNavigate}
					actor={currentPage}
					actorId={1}
					actors={drivers}
					orders={orders}
					onCancelDeliveryTime={handleCancelDeliveryTime}
				/>
			)}

			{currentPage === 'SVS' && (
				<WarehouseOrderList
					onNavigate={handleNavigate}
					setWarehouseOrders={() => {}}
					onBack={() => {
						resetForm();
						setCurrentPage('home');
					}}
				/>
			)}

			{currentPage === 'createTransportation' && (
				<TransportationOrderForm
					form={form}
					setForm={setForm}
					onBack={() => {
						resetForm();
						setCurrentPage('truckCompany');
					}}
				/>
			)}

			{currentPage === 'createWarehouse' && <WarehouseOrderForm onBack={() => setCurrentPage('home')} />}

			{currentPage === 'CheckOrderValidity' && selectedWarehouseOrder && (
				<WarehouseOrder
					order={selectedWarehouseOrder}
					onBack={() => {
						setSelectedWarehouseOrder(null);
						setCurrentPage('SVS');
					}}
				/>
			)}

			{currentPage === 'selectDeliveryTime' && selectedOrderId && (
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
						setCurrentPage('driver');
					}}
					onSuccess={(deliveryTime) => {
						handleDeliveryTimeUpdate(selectedOrderId, deliveryTime);
						setSelectedOrderId(null);
						setCurrentPage('home');
					}}
				/>
			)}
		</div>
	);
}

export default OldPage;
