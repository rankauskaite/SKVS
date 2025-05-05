import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import TransportationOrderForm from '../TransporatationView/TransportationOrderForm';

export default function CreateTransportationPage() {
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

	useEffect(() => {
		const retrieveForm = async () => {
			try {
				const [drivers, trucks, warehouseOrders] = await Promise.all([
					fetch('/api/drivers').then((res) => res.json()),
					fetch('/api/trucks').then((res) => res.json()),
					fetch('/api/available/warehouseOrders').then((res) => res.json()),
				]);
				setForm((prev) => ({ ...prev, drivers, trucks, warehouseOrders }));
			} catch {
				Swal.fire('Klaida', 'Nepavyko užkrauti formos duomenų', 'error');
			}
		};
		retrieveForm();
	}, []);

	return <TransportationOrderForm form={form} setForm={setForm} onBack={() => window.history.back()} />;
}
