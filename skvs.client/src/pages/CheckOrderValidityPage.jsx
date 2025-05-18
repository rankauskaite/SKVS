import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import WarehouseOrder from '../WareHouseView/WarehouseOrder';

export default function CheckOrderValidityPage() {
	const { warehouseOrderId } = useParams();
	const navigate = useNavigate();

	if (!warehouseOrderId) return <div>Kraunama...</div>;

	return <WarehouseOrder Id={warehouseOrderId} onBack={() => navigate(-1)} />;
}
