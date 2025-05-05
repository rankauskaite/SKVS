import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import WarehouseOrder from '../WareHouseView/WarehouseOrder';

export default function CheckOrderValidityPage() {
	const { warehouseOrderId } = useParams();
	const [order, setOrder] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetch(`/api/warehouseorder/${warehouseOrderId}`)
			.then((res) => res.json())
			.then(setOrder)
			.catch((err) => console.error(err));
	}, [warehouseOrderId]);

	if (!order) return <div>Kraunama...</div>;

	return <WarehouseOrder order={order} onBack={() => navigate(-1)} />;
}
