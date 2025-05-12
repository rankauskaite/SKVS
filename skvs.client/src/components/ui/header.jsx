// Header.tsx
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

export default function PageHeader() {
	const pages = [
		{ path: '/driver', label: 'Vairuotojas' },
		{ path: '/truckcompany', label: 'Sunkvežimių įmonė' },
		{ path: '/svs', label: 'SVS' },
	];

	const navigate = useNavigate();

	return (
		<header className='w-full dark bg-background text-foreground shadow-sm px-4 py-2 flex items-center justify-between fixed z-999'>
			<Button variant='ghost' onClick={() => navigate('/')} className='text-2xl font-bold'>
				<div className='text-4xl font-bold text-gray-800 py-2'>🚚</div>
			</Button>

			<div className='flex space-x-2'>
				{pages.map((page) => (
					<Button variant='ghost' key={page.path} onClick={() => navigate(page.path)}>
						{page.label}
					</Button>
				))}
			</div>
		</header>
	);
}
