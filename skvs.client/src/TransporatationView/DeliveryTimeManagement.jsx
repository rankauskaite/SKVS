import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';

function DeliveryTimeManagement({ orderId, orderDate, onBack, onSuccess }) {
	const [times, setTimes] = useState([]);
	const [selectedTime, setSelectedTime] = useState(null);
	const [id, setTimeId] = useState(null);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const provideReservationTimes = async () => {
			fetch(`/api/deliverytimemanagement/${orderId}`)
				.then((res) => {
					if (!res.ok) throw new Error('Nepavyko gauti laikų');
					return res.json();
				})
				.then((data) => {
					setTimes(data.deliveryTimes); // Set delivery times
				})
				.catch((err) => {
					console.error('❌ Klaida gaunant laikus:', err);
					setError('Nepavyko gauti laikų');
				});
		};
		provideReservationTimes();
	}, [orderId]); // Pakeista priklausomybė į orderId, kad API užklausa būtų atliekama, kai keičiasi orderId

	const chooseTime = async () => {
		if (!selectedTime) {
			Swal.fire({
				title: '⚠️ Nepasirinktas laikas',
				text: 'Prašome pasirinkti laiką iš sąrašo',
				icon: 'warning',
			});
			return;
		}

		try {
			const response = await fetch(`/api/deliverytimemanagement/${orderId}/setDeliveryTime`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					deliveryTimeId: id,
					deliveryTime: selectedTime.date,
					ramp: selectedTime.ramp,
					time: selectedTime.time,
				}),
			});

			if (!response.ok) throw new Error('Nepavyko išsaugoti pasirinkto laiko');

			// Sėkmės pranešimas su informacija apie laiką
			Swal.fire({
				title: '✅ Pristatymo laikas pasirinktas!',
				html: `
          <p><strong>Data:</strong> ${selectedTime.date.split('T')[0]}</p>
          <p><strong>Laikas:</strong> ${selectedTime.time / 60}:00</p>
          <p><strong>Rampa:</strong> ${selectedTime.ramp}</p>
        `,
				icon: 'success',
				timer: 2000,
				showConfirmButton: false,
			});

			// Palaukus 2 sekundes, grįžti atgal
			setTimeout(() => {
				// Grįžtame atgal į ankstesnį puslapį
				navigate(-1);
			}, 2000); // 2000 ms (2 sekundės) – tiek laiko rodomas sėkmės pranešimas
		} catch (error) {
			console.error('❌ Klaida siunčiant laiką:', error);
			Swal.fire({
				title: '❌ Klaida',
				text: 'Nepavyko išsaugoti laiko. Bandykite dar kartą.',
				icon: 'error',
			});
		}
	};

	return (
		<div className='p-4'>
			<h2 className='text-xl font-bold mb-4'>🕒 Pasirinkti pristatymo laiką {orderDate}</h2>

			{error && <p className='text-red-500'>{error}</p>}

			{times.length === 0 ? (
				<p>Laikų nėra.</p>
			) : (
				<ul className='mb-4 space-y-2'>
					{times.map((t) => (
						<li key={t.id}>
							<label className='cursor-pointer'>
								<input
									type='radio'
									name='deliveryTime'
									value={t.id}
									onChange={() => {
										setSelectedTime(t);
										setTimeId(t.id);
									}}
									className='mr-2'
								/>
								<span>
									{t.date.split('T')[0]} {t.time / 60}:00 – Rampa: {t.ramp}
								</span>
							</label>
						</li>
					))}
				</ul>
			)}

			<div className='flex gap-4 mt-4'>
				<Button onClick={chooseTime}>Pasirinkti</Button>
				<Button onClick={onBack}>⬅️ Atgal</Button>
			</div>
		</div>
	);
}

export default DeliveryTimeManagement;