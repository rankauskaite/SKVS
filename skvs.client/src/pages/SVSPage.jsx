import WarehouseOrderList from '../WareHouseView/WarehouseOrderList';

export default function SVSPage() {
	return (
		<WarehouseOrderList onNavigate={() => {}} setWarehouseOrders={() => {}} onBack={() => window.history.back()} />
	);
}
