import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';

function CreateWarehouseOrder({ onBack }) {
	const [orderID, setOrderID] = useState('');
	const [count, setCount] = useState(1);
	const [orderDate, setOrderDate] = useState('');
	const [deliveryDate, setDeliveryDate] = useState('');
	const [clientId, setClientId] = useState('');
	const [orderWeight, setOrderWeight] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const warehouseOrder = {
			orderID: parseInt(orderID),
			count: parseInt(count),
			orderDate,
			deliveryDate,
			weight: parseFloat(orderWeight),
			clientId: parseInt(clientId),
		};
		console.log('Sandėlio užsakymas:', warehouseOrder.weight);

		try {
			const response = await fetch('/api/warehouseorder', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(warehouseOrder),
			});

			if (response.ok) {
				Swal.fire('✅ Sukurta', 'Sandėlio užsakymas sėkmingai sukurtas', 'success');
				setOrderID('');
				setCount(1);
				setOrderDate('');
				setDeliveryDate('');
				setClientId('');
				setOrderWeight(null);
			} else {
				const error = await response.text();
				console.error('Klaida:', error);
				Swal.fire('❌ Klaida', 'Nepavyko sukurti sandėlio užsakymo', 'error');
			}
		} catch (err) {
			console.error('Klaida:', err);
		}
	};

	return (
		<div className='p-4 max-w-lg mx-auto'>
			<h2 className='text-xl font-bold mb-4'>📦 Sukurti sandėlio užsakymą</h2>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<input
					type='number'
					placeholder='Užsakymo Nr.'
					value={orderID}
					onChange={(e) => setOrderID(e.target.value)}
					className='w-full border rounded px-3 py-2'
					required
				/>
				<input
					type='number'
					placeholder='Kiekis'
					value={count}
					onChange={(e) => setCount(e.target.value)}
					className='w-full border rounded px-3 py-2'
					required
				/>
				<label className='block'>
					Užsakymo data:
					<input
						type='date'
						value={orderDate}
						onChange={(e) => setOrderDate(e.target.value)}
						className='w-full border rounded px-3 py-2 mt-1'
						required
					/>
				</label>
				<label className='block'>
					Pristatymo data:
					<input
						type='date'
						value={deliveryDate}
						onChange={(e) => setDeliveryDate(e.target.value)}
						className='w-full border rounded px-3 py-2 mt-1'
						required
					/>
				</label>
				<input
					type='float'
					placeholder='Svoris (kg)'
					value={orderWeight}
					onChange={(e) => setOrderWeight(e.target.value)}
					className='w-full border rounded px-3 py-2'
					required
				/>
				<input
					type='number'
					placeholder='Kliento Nr.'
					value={clientId}
					onChange={(e) => setClientId(e.target.value)}
					className='w-full border rounded px-3 py-2'
					required
				/>

				<div className='flex gap-4'>
					<Button type='submit'>💾 Sukurti</Button>
					<Button type='button' onClick={onBack}>
						🔙 Atgal
					</Button>
				</div>
			</form>
		</div>
	);
}

export default CreateWarehouseOrder;
