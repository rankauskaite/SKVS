import React, { useState, useEffect } from 'react';
import TransportationOrdersList from '../TransporatationView/TransportationOrderList.jsx';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

const Driver = () => {
	const actor = 'driver';
	const actorId = 1;

	const navigate = useNavigate();

	const [drivers, setDrivers] = useState([]);

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
	}, []);

	return (
		<TransportationOrdersList
			onNavigate={() => {}}
			actor={actor}
			actorId={actorId}
			actors={drivers}
			//orders={orders}
			//onCancelDeliveryTime={handleCancelDeliveryTime}
		/>
	);
};

export default Driver;
