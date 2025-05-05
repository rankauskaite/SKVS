import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../TableStyles.css';
import { useNavigate } from 'react-router';
import Routes from '../pages/Routes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const TransportationOrdersList = ({ actor, actorId, actors }) => {
	const [orders, setOrders] = useState([]);

	const navigate = useNavigate();

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
		navigate(Routes.createTransportationOrder);
	};

	const initiateTimeReservation = (orderId) => {
		navigate(Routes.selectTime(orderId));
	};

	const initiateTimeChange = (orderId) => {
		navigate(Routes.selectTime(orderId));
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
					<Button onClick={initiateTransportationOrderCreation}>➕ Naujas pervežimo užsakymas</Button>
				</div>
			)}
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Užsakymo Nr.</TableHead>
						<TableHead>Aprašymas</TableHead>
						<TableHead>Adresas</TableHead>
						<TableHead>Pristatymo laikas</TableHead>
						<TableHead>Rampa</TableHead>
						<TableHead>Rezervuotas laikas</TableHead>
						{actor !== 'driver' && (
							<>
								<TableHead>Būsena</TableHead>
								<TableHead>Pakeliui</TableHead>
								<TableHead>Vairuotojas</TableHead>
							</>
						)}
						<TableHead>Sunkvežimio numeris</TableHead>
						{actor === 'driver' && <TableHead>Veiksmai</TableHead>}
					</TableRow>
				</TableHeader>
				<TableBody>
					{orders.map((order) => (
						<TableRow key={order.orderId}>
							<TableCell>{order.orderId}</TableCell>
							<TableCell>{order.description}</TableCell>
							<TableCell>{order.address}</TableCell>
							<TableCell>
								{order.deliveryTime ? new Date(order.deliveryTime).toLocaleDateString('lt-LT') : 'Nepaskirtas'}
							</TableCell>
							<TableCell>{order.ramp ?? '-'}</TableCell>
							<TableCell>
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
							</TableCell>
							{actor !== 'driver' && (
								<>
									<TableCell>{stateLabelsLt[order.state] || order.state}</TableCell>
									<TableCell>{order.isOnTheWay ? 'Taip' : 'Ne'}</TableCell>
									<TableCell>
										{order.assignedDriverId
											? `${actors.find((driver) => driver.userId === order.assignedDriverId)?.name} ${
													actors.find((driver) => driver.userId === order.assignedDriverId)?.surname
											  }`
											: 'Nėra'}
									</TableCell>
								</>
							)}
							<TableCell>{order.truckPlateNumber || '-'}</TableCell>
							{actor === 'driver' && (
								<TableCell className='flex flex-col gap-2'>
									<Button onClick={() => {}}>📋 Detalės</Button>
									{order.deliveryTime &&
									new Date(order.deliveryTime).getHours() === 0 &&
									new Date(order.deliveryTime).getMinutes() === 0 ? (
										<Button onClick={() => initiateTimeReservation(order.orderId)}>🕒 Priskirti laiką</Button>
									) : (
										<>
											<Button onClick={() => initiateTimeChange(order.orderId)}>✏️ Keisti laiką</Button>
											<Button onClick={() => confirmCancellation(order.orderId)}>❌ Atšaukti laiką</Button>
										</>
									)}
								</TableCell>
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
export default TransportationOrdersList;
