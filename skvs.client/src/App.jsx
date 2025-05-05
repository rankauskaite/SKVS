import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from './pages/Layout';
import Home from './pages/Home';
import OldPage from './OldPage';
import Driver from './pages/Driver';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route index element={<Home />} />
					<Route path='/driver' element={<Driver />} />
					<Route path='/oldpage' element={<OldPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
