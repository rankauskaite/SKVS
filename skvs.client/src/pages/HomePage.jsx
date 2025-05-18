import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Ripple } from '@/components/ui/background';

export default function HomePage() {
	const navigate = useNavigate();

	const pages = [
		{ path: '/driver', label: 'Vairuotojas' },
		{ path: '/truckcompany', label: 'Sunkvežimių įmonė' },
		{ path: '/svs', label: 'SVS' },
	];

	return (
		<div className='p-8 max-w-xl mx-auto content-center text-center'>
			<p className='text-4xl font-extrabold mb-4 z-999'>🚚 SKVS</p>
			<div className='grid grid-cols-1 gap-5 p-4 m-4 z-999'>
				{pages.map((page) => (
					<Button key={page.path} onClick={() => navigate(page.path)}>
						{page.label}
					</Button>
				))}
			</div>
			<Ripple />
		</div>
	);
}
