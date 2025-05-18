import { useEffect, useState } from 'react';
import TransportationOrdersList from '../TransporatationView/TransportationOrderList';
import Swal from 'sweetalert2';

export default function TruckCompanyPage() {
	const [drivers, setDrivers] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const driversRes = await fetch('/api/transportationorder/drivers');

				if (!driversRes.ok) throw new Error();

				setDrivers(await driversRes.json());
			} catch {
				Swal.fire('Klaida', 'Nepavyko užkrauti duomenų', 'error');
			}
		};
		fetchData();
	}, []);

	return <TransportationOrdersList actor='truckCompany' actorId={1} actors={drivers} />;
}
