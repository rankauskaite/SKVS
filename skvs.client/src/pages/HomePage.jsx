import { useNavigate } from 'react-router';

export default function HomePage() {
	const navigate = useNavigate();

	const pages = [
		{ path: '/driver', label: 'Vairuotojas' },
		{ path: '/truckcompany', label: 'Sunkvežimių įmonė' },
		{ path: '/svs', label: 'SVS' },
	];

	return (
		<div className='p-8 max-w-xl mx-auto'>
			<h1 className='text-3xl font-bold mb-6 text-center'>🚚 SKVS</h1>
			<div className='grid grid-cols-1 gap-5 p-4 m-4'>
				{pages.map((page) => (
					<button
						key={page.path}
						onClick={() => navigate(page.path)}
						className='block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl transition'
					>
						{page.label}
					</button>
				))}
			</div>
		</div>
	);
}
