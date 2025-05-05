import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import DeliveryTimeManagement from '../TransporatationView/DeliveryTimeManagement';

export default function DeliveryTimePage() {
	const { orderId } = useParams();
	const [orderDate, setOrderDate] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetch(`/api/transportationorder/${orderId}`)
			.then((res) => res.json())
			.then((data) => setOrderDate(data.deliveryTime))
			.catch((err) => console.error('Klaida gaunant užsakymą:', err));
	}, [orderId]);

	return (
		<DeliveryTimeManagement
			orderId={orderId}
			orderDate={orderDate}
			onSelect={() => {}}
			onBack={() => navigate(-1)}
			onSuccess={() => {}}
		/>
	);
}
