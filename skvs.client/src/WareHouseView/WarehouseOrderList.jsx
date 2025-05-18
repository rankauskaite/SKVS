import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../TableStyles.css';
import { useNavigate } from 'react-router';
import Routes from '../pages/Routes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const WarehouseOrderList = () => {
	const [truckingSelection, setTruckingSelection] = useState({});
	const [truckingCompanies, setTruckingCompanies] = useState([]);
	const [warehouseOrders, setOrders] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		const retrieveWarehouseOrderList = async () => {
			try {
				const getWarehouseOrders = await fetch('/api/warehouseorder');
				if (!getWarehouseOrders.ok) throw new Error('Nepavyko gauti užsakymų');
				const data = await getWarehouseOrders.json();
				setOrders(data);
			} catch (err) {
				Swal.fire('Klaida', 'Nepavyko užkrauti užsakymų', 'error');
			}
		};

		retrieveWarehouseOrderList();
	}, []); // Kai pasikeičia actor ar driverId, iš naujo užkraunami duomenys

	useEffect(() => {
		const retrieveListOfTruckingCompanies = async () => {
			try {
				const getTruckingCompanyList = await fetch('/api/warehouseorder/truckingcompanies');
				if (!getTruckingCompanyList.ok) throw new Error('Nepavyko gauti pervežimo įmonių');
				const data = await getTruckingCompanyList.json();
				setTruckingCompanies(data);
			} catch (err) {
				Swal.fire('Klaida', 'Nepavyko gauti pervežimo įmonių', 'error');
			}
		};
		retrieveListOfTruckingCompanies();
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
			} else {
				Swal.fire('❌ Klaida', 'Nepavyko atšaukti užsakymo', 'error');
			}
		}
	};

	const selectTruckingCompany = async (orderId) => {
		const selectedName = truckingSelection[orderId];
		const selectedCompany = selectedName
			? truckingCompanies.find((company) => company.truckingCompanyName === selectedName)
			: null;

		if (selectedName && !selectedCompany) {
			Swal.fire('❌ Klaida', 'Nepavyko rasti pasirinktos įmonės', 'error');
			return;
		}

		const setSelectedTruckingCompany = await fetch(`/api/warehouseorder/${orderId}/settruckingcompany`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userId: selectedCompany ? selectedCompany.userId : null }),
		});

		if (setSelectedTruckingCompany.ok) {
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
		const truckingCompaniesSelection = {};
		warehouseOrders.forEach((order) => {
			if (order.truckingCompanyUserId) {
				const company = truckingCompanies.find((company) => company.userId === order.truckingCompanyUserId);
				if (company) {
					truckingCompaniesSelection[order.id] = company.truckingCompanyName;
				}
			} else {
				truckingCompaniesSelection[order.id] = '';
			}
		});
		setTruckingSelection(truckingCompaniesSelection);
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
			<div className='mb-6 flex gap-4'>
				<Button onClick={() => navigate(Routes.createWarehouseOrder)}>📦 Naujas sandėlio užsakymas</Button>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Užsakymo Nr.</TableHead>
						<TableHead>Klientas</TableHead>
						<TableHead>Užsakymo data</TableHead>
						<TableHead>Pristatymo data</TableHead>
						<TableHead>Kiekis</TableHead>
						<TableHead>Svoris (Kg)</TableHead>
						<TableHead>Pervežimo užsakymo Nr.</TableHead>
						<TableHead>Transporto įmonė</TableHead>
						<TableHead>Veiksmai</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{warehouseOrders.map((order) => (
						<TableRow key={order.id}>
							<TableCell>{order.orderID}</TableCell>
							<TableCell>{order.clientId}</TableCell>
							<TableCell>
								{order.orderDate ? new Date(order.orderDate).toLocaleDateString('lt-LT') : 'Nepaskirta'}
							</TableCell>
							<TableCell>
								{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('lt-LT') : 'Nepaskirta'}
							</TableCell>
							<TableCell>{order.count}</TableCell>
							<TableCell>{order.weight}</TableCell>
							<TableCell>{order.transportationOrderID ?? '-'}</TableCell>
							<TableCell>
								<div className='flex items-center gap-2'>
									<Select
										value={truckingSelection[order.id] || '__none__'}
										onValueChange={(value) =>
											setTruckingSelection((prev) => ({
												...prev,
												[order.id]: value === '__none__' ? '' : value,
											}))
										}
									>
										<SelectTrigger className='w-[200px]'>
											<SelectValue placeholder='-- Pasirinkti --' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='__none__'>-- Pasirinkti --</SelectItem>
											{truckingCompanies.map((company) => (
												<SelectItem key={company.userId} value={company.truckingCompanyName}>
													{company.truckingCompanyName}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<Button onClick={() => selectTruckingCompany(order.id)}>💼 Priskirti</Button>
								</div>
							</TableCell>
							<TableCell>
								<div className='flex flex-col gap-2'>
									<Button onClick={() => navigate(Routes.checkWarehouseOrder(order.id))}>🔎 Patikrinti krovinį</Button>
									<Button onClick={() => handleCancel(order.id)}>❌ Atšaukti užsakymą</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default WarehouseOrderList;
