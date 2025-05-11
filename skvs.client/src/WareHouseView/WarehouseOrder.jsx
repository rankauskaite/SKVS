import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

function CheckOrderValidity({ order, onBack }) {
	const [inputCount, setInputCount] = useState('');
	const [inputWeight, setInputWeight] = useState('');
	const [orderInfo, setOrderInfo] = useState({
		orderID: '',
		orderDate: '',
		deliveryDate: '',
		clientId: '',
		count: '',
		weight: '',
	});
	const [validationResult, setValidationResult] = useState('');

	useEffect(() => {
		if (order) {
			setOrderInfo({
				orderID: order.orderID || '',
				orderDate: order.orderDate?.substring(0, 10) || '',
				deliveryDate: order.deliveryDate?.substring(0, 10) || '',
				clientId: order.clientId || '',
				count: order.count || '',
				weight: order.weight || '',
			});
		}
	}, [order]);

	const handleCheck = (e) => {
		e.preventDefault();

		const parsedWeight = parseFloat(inputWeight);
		const parsedCount = parseInt(inputCount);

		if (isNaN(parsedWeight) || parsedWeight <= 0 || isNaN(parsedCount) || parsedCount <= 0) {
			setValidationResult('⚠️ Įveskite teisingą kiekį ir svorį.');
			return;
		}

		const weightMatches = parsedWeight === parseFloat(orderInfo.weight);
		const countMatches = parsedCount === parseInt(orderInfo.count);

		if (weightMatches && countMatches) {
			setValidationResult('✅ Kiekis ir svoris sutampa su užsakymu.');
		} else if (!weightMatches && !countMatches) {
			setValidationResult('❌ Kiekis ir svoris nesutampa su užsakymu.');
		} else if (!weightMatches) {
			setValidationResult('❌ Svoris nesutampa su užsakymu.');
		} else {
			setValidationResult('❌ Kiekis nesutampa su užsakymu.');
		}
	};

	return (
		<div className='p-4 max-w-lg mx-auto'>
			<h2 className='text-xl font-bold mb-4'>📦 Užsakymo Tikrinimas</h2>
			<div>
				<p>
					<strong>Užsakymo Nr.:</strong> {orderInfo.orderID}
				</p>
				<p>
					<strong>Užsakymo data:</strong> {orderInfo.orderDate}
				</p>
				<p>
					<strong>Pristatymo data:</strong> {orderInfo.deliveryDate}
				</p>
				<p>
					<strong>Kliento Nr.:</strong> {orderInfo.clientId}
				</p>
				<p>
					<strong>Užsakymo kiekis:</strong> {orderInfo.count}
				</p>
				<p>
					<strong>Užsakymo svoris:</strong> {orderInfo.weight} kg
				</p>
			</div>

			<form onSubmit={handleCheck} className='space-y-4 mt-6'>
				<input
					type='number'
					placeholder='Įveskite kiekį'
					value={inputCount}
					onChange={(e) => setInputCount(e.target.value)}
					className='w-full border rounded px-3 py-2'
					required
				/>
				<input
					type='number'
					step='0.01'
					placeholder='Įveskite svorį (kg)'
					value={inputWeight}
					onChange={(e) => setInputWeight(e.target.value)}
					className='w-full border rounded px-3 py-2'
					required
				/>

				<div className='flex gap-4'>
					<Button>🔍 Patikrinti</Button>
					<Button onClick={onBack}>🔙 Atgal</Button>
				</div>
			</form>

			{validationResult && <p className='mt-4 text-center font-semibold text-lg'>{validationResult}</p>}
		</div>
	);
}

export default CheckOrderValidity;
