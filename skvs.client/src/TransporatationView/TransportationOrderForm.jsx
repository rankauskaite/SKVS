import { useState } from 'react';
import Swal from 'sweetalert2';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

function CreateTransportationOrder({ form, setForm, onBack }) {
	const [error, setError] = useState('');

	// 11. selectWarehouseOrder() ir 12. chooseWarehouseOrder()
	const selectWarehouseOrder = (orderId) => {
		const isSelected = form.warehouseOrderIds.includes(orderId);
		const updated = isSelected
			? form.warehouseOrderIds.filter((id) => id !== orderId)
			: [...form.warehouseOrderIds, orderId];

		setForm((prev) => ({ ...prev, warehouseOrderIds: updated }));
	};

	// 13. chooseDriver()
	const chooseDriver = (e) => {
		const selected = form.drivers.find((d) => d.userId === parseInt(e.target.value));
		setForm((prev) => ({ ...prev, selectedDriver: selected || null }));
	};

	// 14. chooseTruck()
	const chooseTruck = (e) => {
		const selected = form.trucks.find((t) => t.plateNumber === e.target.value);
		setForm((prev) => ({ ...prev, selectedTruck: selected || null }));
	};

	// 15. checkFormedTransportationOrder()
	const checkFormedTransportationOrder = () => {
		if (form.warehouseOrderIds.length === 0) {
			setError('Pasirinkite bent vieną sandėlio užsakymą.');
			return false;
		}
		if (!form.address) {
			setError('Adresas yra privalomas.');
			return false;
		}
		if (!form.deliveryTime) {
			setError('Pristatymo laikas yra privalomas.');
			return false;
		}
		if (!form.selectedDriver) {
			setError('Pasirinkite vairuotoją.');
			return false;
		}
		if (!form.selectedTruck) {
			setError('Pasirinkite sunkvežimį.');
			return false;
		}
		setError('');
		return true;
	};

	// 16. createTransportationOrder() (siuntimas į serverį)
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!checkFormedTransportationOrder()) {
			return;
		}

		const body = {
			description: form.description,
			address: form.address,
			deliveryTime: form.deliveryTime || null,
			state: form.state,
			isCancelled: false,
			isCompleted: false,
			isOnTheWay: false,
			createdById: form.createdById,
			assignedDriverId: form.selectedDriver?.userId ?? null,
			truckPlateNumber: form.selectedTruck?.plateNumber ?? null,
			warehouseOrderIds: form.warehouseOrderIds,
		};

		console.log('Siunčiami duomenys:', body);

		try {
			const response = await fetch('/api/transportationorder', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});

			if (response.ok) {
				// 18. showSuccessMessage() ir 19. formMessage()
				Swal.fire('✅ Sukurta', 'Pervežimo užsakymas sėkmingai sukurtas', 'success', {
					timer: 2000,
					showConfirmButton: false,
				});
				// Palaukus 2 sekundes, grįžti atgal
				setTimeout(() => {
					// Grįžtame atgal į ankstesnį puslapį
					onBack();

					// // Galite atlikti papildomą sėkmės apdorojimą, jei reikia
					// if (typeof onSuccess === "function") {
					//   onSuccess(selectedTime);
					// }
				}, 2000); // 2000 ms (2 sekundės) – tiek laiko rodomas sėkmės pranešimas
			} else {
				const errText = await response.text();
				console.error('Klaida:', errText);
				// 22. error()
				Swal.fire('❌ Klaida', 'Nepavyko sukurti pervežimo užsakymo: ' + errText, 'error');
			}
		} catch (error) {
			console.error('Klaida:', error);
			// 22. error()
			Swal.fire('❌ Klaida', 'Nepavyko sukurti pervežimo užsakymo: tinklo klaida', 'error');
		}
	};

	return (
		<div className='p-4'>
			<h2 className='text-xl font-bold mb-4'>➕ Naujas pervežimo užsakymas</h2>
			<form onSubmit={handleSubmit} className='space-y-3'>
				<input
					placeholder='Aprašymas'
					value={form.description}
					onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
				/>
				<input
					placeholder='Adresas'
					value={form.address}
					onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
				/>
				<Calendar
					mode='single'
					selected={form.deliveryTime}
					onSelect={(date) =>
						setForm((prev) => ({
							...prev,
							deliveryTime: date,
						}))
					}
					initialFocus
				/>

				<Select value={form.state} onValueChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))}>
					<SelectTrigger>
						<SelectValue placeholder='Pasirink būseną' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='Formed'>Sudarytas</SelectItem>
						<SelectItem value='Scheduled'>Suplanuotas</SelectItem>
						<SelectItem value='InProgress'>Vykdomas</SelectItem>
						<SelectItem value='Completed'>Įvykdytas</SelectItem>
						<SelectItem value='Cancelled'>Atšauktas</SelectItem>
					</SelectContent>
				</Select>

				{/* Vairuotojas */}
				<div>
					<label className='block font-semibold'>👨‍✈️ Pasirink vairuotoją:</label>
					<Select
						value={form.selectedDriver?.userId || '__none__'}
						onValueChange={(value) => chooseDriver({ target: { value: value === '__none__' ? '' : value } })}
					>
						<SelectTrigger className='mt-1 w-full'>
							<SelectValue placeholder='-- Pasirinkti vairuotoją --' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='__none__'>-- Pasirinkti vairuotoją --</SelectItem>
							{form.drivers.map((driver) => (
								<SelectItem key={driver.userId} value={driver.userId}>
									{driver.name} {driver.surname}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Vilkikas */}
				<div>
					<label className='block font-semibold'>🚛 Pasirink vilkiką:</label>
					<Select
						value={form.selectedTruck?.plateNumber || '__none__'}
						onValueChange={(value) => chooseTruck({ target: { value: value === '__none__' ? '' : value } })}
					>
						<SelectTrigger className='mt-1 w-full'>
							<SelectValue placeholder='-- Pasirinkti vilkiką --' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='__none__'>-- Pasirinkti vilkiką --</SelectItem>
							{form.trucks.map((truck) => (
								<SelectItem key={truck.plateNumber} value={truck.plateNumber}>
									{truck.plateNumber}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Sandėlio užsakymai */}
				<div>
					<h3 className='font-semibold'>✅ Pasirink sandėlio užsakymus:</h3>
					{form.warehouseOrders.length === 0 ? (
						<p>Nėra laisvų užsakymų</p>
					) : (
						<div className='flex flex-col gap-2 mt-2'>
							{form.warehouseOrders.map((wo) => (
								<div key={wo.id}>
									<label className='flex items-center gap-3 px-3 py-2 border rounded-md'>
										<Checkbox
											checked={form.warehouseOrderIds.includes(wo.id)}
											onCheckedChange={() => selectWarehouseOrder(wo.id)}
										/>
										<span>Užsakymas #{wo.id}</span>
										<span>– Kiekis: {wo.count}</span>
										<span>– Klientas ID: {wo.clientId}</span>
									</label>
								</div>
							))}
						</div>
					)}
				</div>

				{error && <p className='text-red-600'>{error}</p>}

				<div className='flex gap-4 mt-4'>
					<Button>💾 Sukurti</Button>
					<Button onClick={onBack}>⬅️ Atgal</Button>
				</div>
			</form>
		</div>
	);
}

export default CreateTransportationOrder;
