import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from './pages/Layout';
import DriverPage from './pages/DriverPage';
import TruckCompanyPage from './pages/TruckCompanyPage';
import SVSPage from './pages/SVSPage';
import CreateTransportationPage from './pages/CreateTransportationPage';
import CreateWarehousePage from './pages/CreateWarehousePage';
import DeliveryTimePage from './pages/DeliveryTimePage';
import CheckOrderValidityPage from './pages/CheckOrderValidityPage';
import HomePage from './pages/HomePage';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path='/' element={<HomePage />} />
					<Route path='/driver' element={<DriverPage />} />
					<Route path='/truck-company' element={<TruckCompanyPage />} />
					<Route path='/svs' element={<SVSPage />} />
					<Route path='/create-transportation' element={<CreateTransportationPage />} />
					<Route path='/create-warehouse' element={<CreateWarehousePage />} />
					<Route path='/select-delivery-time/:orderId' element={<DeliveryTimePage />} />
					<Route path='/check-order/:warehouseOrderId' element={<CheckOrderValidityPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
