import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../TableStyles.css';

const TransportationOrdersList = ({ onNavigate, actor, actorId, actors }) => {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const initiateTransportationOrdersView = async () => {
			try {
				const url =
					actor === 'driver' && actorId ? `/api/transportationorder?userId=${actorId}` : '/api/transportationorder';

				const res = await fetch(url);
				if (!res.ok) throw new Error('Nepavyko gauti užsakymų');
				const data = await res.json();
				setOrders(data);
			} catch (err) {
				console.error('❌ Klaida gaunant užsakymus:', err);
				Swal.fire('Klaida', 'Nepavyko užkrauti užsakymų', 'error');
			}
		};

		initiateTransportationOrdersView();
	}, [actor, actorId]);

	const initiateTransportationOrderCreation = () => {
		onNavigate('createTransportation');
	};

	const initiateTimeReservation = async (orderId, orderDate) => {
		onNavigate('selectDeliveryTime', orderId, orderDate);
	};

	const initiateTimeChange = async (orderId, orderDate) => {
		onNavigate('selectDeliveryTime', orderId, orderDate);
	};

	const confirmCancellation = async (orderId) => {
		const confirm = await Swal.fire({
			title: 'Ar tikrai norite atšaukti rezervaciją?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Taip',
			cancelButtonText: 'Ne',
		});

		if (confirm.isConfirmed) {
			const res = await fetch(`/api/deliverytimemanagement/${orderId}/cancelDeliveryTime`, {
				method: 'PUT',
			});

			if (res.ok) {
				Swal.fire('✅ Atšaukta', 'Rezervacija sėkmingai atšaukta', 'success');

				setOrders((prev) =>
					prev.map((order) => (order.orderId === orderId ? { ...order, deliveryTime: null, ramp: null } : order))
				);
			} else {
				Swal.fire('❌ Klaida', 'Nepavyko atšaukti rezervacijos', 'error');
			}
		}
	};

	const stateLabelsLt = {
		Formed: 'Sudarytas',
		Scheduled: 'Suplanuotas',
		InProgress: 'Vykdomas',
		Completed: 'Įvykdytas',
		Cancelled: 'Atšauktas',
	};

	if (orders.length === 0)
		return (
			<div className='full-page-center'>
				<p>Nėra jokių užsakymų.</p>
			</div>
		);

	return (
		<div className='full-page-center'>
			<h2 className='table-title'>
				Pervežimo užsakymai
				{actor === 'driver' &&
					` - vairuotojas ${actors.find((driver) => driver.userId === actorId)?.name || 'Nėra pasirinktas'}`}
			</h2>
			{actor !== 'driver' && (
				<div className='mt-4 flex gap-4'>
					<button className='bg-blue-600 text-white px-4 py-2 rounded' onClick={initiateTransportationOrderCreation}>
						➕ Naujas pervežimo užsakymas
					</button>
				</div>
			)}
			<table className='orders-table'>
				<thead>
					<tr>
						<th>Užsakymo Nr.</th>
						<th>Aprašymas</th>
						<th>Adresas</th>
						<th>Pristatymo laikas</th>
						<th>Rampa</th>
						<th>Rezervuotas laikas</th>
						{actor !== 'driver' && (
							<>
								<th>Būsena</th>
								<th>Pakeliui</th>
								<th>Vairuotojas</th>
							</>
						)}
						<th>Sunkvežimio numeris</th>
						{actor === 'driver' && <th>Veiksmai</th>}
					</tr>
				</thead>
				<tbody>
					{orders.map((order) => (
						<tr key={order.orderId}>
							<td>{order.orderId}</td>
							<td>{order.description}</td>
							<td>{order.address}</td>
							<td>{order.deliveryTime ? new Date(order.deliveryTime).toLocaleDateString('lt-LT') : 'Nepaskirtas'}</td>
							<td>{order.ramp ?? '-'}</td>
							<td>
								{order.deliveryTime
									? new Date(order.deliveryTime).getHours() === 0 && new Date(order.deliveryTime).getMinutes() === 0
										? '-'
										: `${new Date(order.deliveryTime).getHours().toString().padStart(2, '0')}:${new Date(
												order.deliveryTime
										  )
												.getMinutes()
												.toString()
												.padStart(2, '0')}`
									: '-'}
							</td>
							{actor !== 'driver' && (
								<>
									<td>{stateLabelsLt[order.state] || order.state}</td>
									<td>{order.isOnTheWay ? 'Taip' : 'Ne'}</td>
									<td>
										{order.assignedDriverId
											? `${actors.find((driver) => driver.userId === order.assignedDriverId)?.name} ${
													actors.find((driver) => driver.userId === order.assignedDriverId)?.surname
											  }`
											: 'Nėra'}
									</td>
								</>
							)}
							<td>{order.truckPlateNumber || '-'}</td>
							{actor === 'driver' && (
								<td className='flex flex-col gap-2'>
									<button
										className='bg-green-500 text-white px-2 py-1 rounded text-sm'
										onClick={() => onNavigate('orderDetails', order.orderId)}
									>
										📋 Detalės
									</button>
									{order.deliveryTime &&
									new Date(order.deliveryTime).getHours() === 0 &&
									new Date(order.deliveryTime).getMinutes() === 0 ? (
										<button
											className='bg-blue-500 text-white px-2 py-1 rounded text-sm'
											onClick={() => initiateTimeReservation(order.orderId, order.deliveryTime)}
										>
											🕒 Priskirti laiką
										</button>
									) : (
										<>
											<button
												className='bg-yellow-500 text-white px-2 py-1 rounded text-sm'
												onClick={() => initiateTimeChange(order.orderId, order.deliveryTime)}
											>
												✏️ Keisti laiką
											</button>
											<button
												className='bg-red-500 text-white px-2 py-1 rounded text-sm'
												onClick={() => confirmCancellation(order.orderId)}
											>
												❌ Atšaukti laiką
											</button>
										</>
									)}
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default TransportationOrdersList;
