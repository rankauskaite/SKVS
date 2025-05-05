import { Link } from 'react-router-dom';

export default function HomePage() {
	const pages = [
		{ path: '/driver', label: 'Driver View' },
		{ path: '/truck-company', label: 'Truck Company View' },
		{ path: '/svs', label: 'SVS View' },
		{ path: '/create-transportation', label: 'Create Transportation Order' },
		{ path: '/create-warehouse', label: 'Create Warehouse Order' },
		{ path: '/select-delivery-time/1', label: 'Select Delivery Time (Example ID)' },
		{ path: '/check-order/1', label: 'Check Order Validity (Example ID)' },
	];

	return (
		<div className='p-8 max-w-xl mx-auto'>
			<h1 className='text-3xl font-bold mb-6 text-center'>🚚 SKVS</h1>
			<div className='grid grid-cols-1 gap-4'>
				{pages.map((page) => (
					<Link
						to={page.path}
						key={page.path}
						className='block bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl transition'
					>
						{page.label}
					</Link>
				))}
			</div>
		</div>
	);
}
