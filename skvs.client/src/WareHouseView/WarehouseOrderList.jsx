import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../TableStyles.css';

const WarehouseOrderList = ({ onNavigate, setWarehouseOrders, onBack }) => {
	const [truckingSelection, setTruckingSelection] = useState({});
	const [truckingCompanies, setTruckingCompanies] = useState([]);
	const [warehouseOrders, setOrders] = useState([]);
	
	  useEffect(() => {
		const initiateTransportationOrdersView = async () => {
		  try {
			// Jei aktorius yra "driver", pridedame vairuotojo ID į užklausą
			const url = "/api/warehouseorder";
			
			const res = await fetch(url);
			if (!res.ok) throw new Error("Nepavyko gauti užsakymų");
			const data = await res.json();
			setOrders(data);
		  } catch (err) {
			console.error("❌ Klaida gaunant užsakymus:", err);
			Swal.fire("Klaida", "Nepavyko užkrauti užsakymų", "error");
		  }
		};
	
		initiateTransportationOrdersView();
	  }, []); // Kai pasikeičia actor ar driverId, iš naujo užkraunami duomenys

	useEffect(() => {
		const fetchCompanies = async () => {
			const res = await fetch('/api/warehouseorder/truckingcompanies');
			if (res.ok) {
				const data = await res.json();
				setTruckingCompanies(data);
			}
		};
		fetchCompanies();
	}, []);

	const handleCancel = async (orderId) => {
		const confirm = await Swal.fire({
			title: 'Ar tikrai norite atšaukti užsakymą?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Taip',
			cancelButtonText: 'Ne',
		});

		if (confirm.isConfirmed) {
			const res = await fetch(`/api/warehouseorder/${orderId}/cancel`, {
				method: 'PUT',
			});

			if (res.ok) {
				Swal.fire('✅ Atšaukta', 'Užsakymas sėkmingai atšauktas', 'success');
				setWarehouseOrders((prev) => prev.filter((order) => order.id !== orderId));
			} else {
				Swal.fire('❌ Klaida', 'Nepavyko atšaukti užsakymo', 'error');
			}
		}
	};

	const handleSetTruckingCompany = async (orderId) => {
		const selectedName = truckingSelection[orderId];
		const selectedCompany = selectedName
			? truckingCompanies.find((company) => company.truckingCompanyName === selectedName)
			: null;

		if (selectedName && !selectedCompany) {
			Swal.fire('❌ Klaida', 'Nepavyko rasti pasirinktos įmonės', 'error');
			return;
		}

		const res = await fetch(`/api/warehouseorder/${orderId}/settruckingcompany`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userId: selectedCompany ? selectedCompany.userId : null }),
		});

		if (res.ok) {
			Swal.fire(
				'✅ Pavyko',
				selectedName ? 'Transporto įmonė priskirta sėkmingai' : 'Transporto įmonė pašalinta',
				'success'
			);
		} else {
			Swal.fire('❌ Klaida', 'Nepavyko priskirti įmonės', 'error');
		}
	};

	useEffect(() => {
		const initialSelection = {};
		warehouseOrders.forEach((order) => {
			if (order.truckingCompanyUserId) {
				const company = truckingCompanies.find((company) => company.userId === order.truckingCompanyUserId);
				if (company) {
					initialSelection[order.id] = company.truckingCompanyName;
				}
			} else {
				initialSelection[order.id] = '';
			}
		});
		setTruckingSelection(initialSelection);
	}, [warehouseOrders, truckingCompanies]);

	if (warehouseOrders.length === 0) {
		return (
			<div className='full-page-center'>
				<p>Nėra jokių užsakymų.</p>
			</div>
		);
	}

	return (
		<div className='full-page-center'>
			<h2 className='table-title'>Sandėlio užsakymai</h2>
			<div className='mt-4 flex gap-4'>
				<button className='bg-blue-600 text-white px-4 py-2 rounded' onClick={() => onNavigate('createWarehouse')}>
					📦 Naujas sandėlio užsakymas
				</button>
			</div>
			<table className='orders-table'>
				<thead>
					<tr>
						<th>Užsakymo Nr.</th>
						<th>Klientas</th>
						<th>Užsakymo data</th>
						<th>Pristatymo data</th>
						<th>Kiekis</th>
						<th>Svoris(Kg)</th>
						<th>Pervežimo užsakymo Nr.</th>
						<th>Transporto įmonė</th>
						<th>Veiksmai</th>
					</tr>
				</thead>
				<tbody>
					{warehouseOrders.map((order) => (
						<tr key={order.id}>
							<td>{order.orderID}</td>
							<td>{order.clientId}</td>
							<td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString('lt-LT') : 'Nepaskirta'}</td>
							<td>{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('lt-LT') : 'Nepaskirta'}</td>
							<td>{order.count}</td>
							<td>{order.weight}</td>
							<td>{order.transportationOrderID ?? '-'}</td>
							<td>
								<select
									className='px-2 py-1 text-sm rounded'
									value={truckingSelection[order.id] || ''}
									onChange={(e) =>
										setTruckingSelection((prev) => ({
											...prev,
											[order.id]: e.target.value,
										}))
									}
								>
									<option value=''>-- Pasirinkti --</option>
									{truckingCompanies.map((company) => (
										<option key={company.userId} value={company.truckingCompanyName}>
											{company.truckingCompanyName}
										</option>
									))}
								</select>
								<button
									className='ml-2 bg-green-600 text-white px-2 py-1 rounded text-sm'
									onClick={() => handleSetTruckingCompany(order.id)}
								>
									💼 Priskirti
								</button>
							</td>
							<td className='flex flex-col gap-2'>
								<button
									className='bg-yellow-500 text-white px-2 py-1 rounded text-sm'
									onClick={() => onNavigate('editWarehouseOrder', order.id)}
								>
									✏️ Redaguoti užsakymą
								</button>
								<button className='bg-yellow-500 text-white px-2 py-1 rounded text-sm' onClick={() => onNavigate('CheckOrderValidity', order)}>
									🔎 Patikrinti krovinį
								</button>
								<button
									className='bg-red-500 text-white px-2 py-1 rounded text-sm'
									onClick={() => handleCancel(order.id)}
								>
									❌ Atšaukti užsakymą
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default WarehouseOrderList;
