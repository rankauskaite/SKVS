import WarehouseOrderForm from '../WareHouseView/WarehouseOrderForm';

export default function CreateWarehousePage() {
	return <WarehouseOrderForm onBack={() => window.history.back()} />;
}
