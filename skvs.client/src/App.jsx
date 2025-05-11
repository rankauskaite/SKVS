import { Routes as RouterRoutes, Route } from 'react-router';
import Layout from './pages/Layout';
import DriverPage from './pages/DriverPage';
import TruckCompanyPage from './pages/TruckCompanyPage';
import SVSPage from './pages/SVSPage';
import CreateTransportationPage from './pages/CreateTransportationPage';
import CreateWarehousePage from './pages/CreateWarehousePage';
import DeliveryTimePage from './pages/DeliveryTimePage';
import CheckOrderValidityPage from './pages/CheckOrderValidityPage';
import HomePage from './pages/HomePage';
import OldPage from './pages/OldPage';
import Routes from './pages/Routes';

export default function App() {
	return (
		<RouterRoutes>
			<Route element={<Layout />}>
				<Route path={Routes.home} element={<HomePage />} />
				<Route path={Routes.oldPage} element={<OldPage />} />
				<Route path={Routes.truckCompany} element={<TruckCompanyPage />} />
				<Route path={Routes.createTransportationOrder} element={<CreateTransportationPage />} />
				<Route path={Routes.driver} element={<DriverPage />} />
				<Route path={Routes.selectTime()} element={<DeliveryTimePage />} />
				<Route path={Routes.svs} element={<SVSPage />} />
				<Route path={Routes.createWarehouseOrder} element={<CreateWarehousePage />} />
				<Route path={Routes.checkWarehouseOrder()} element={<CheckOrderValidityPage />} />
			</Route>
		</RouterRoutes>
	);
}