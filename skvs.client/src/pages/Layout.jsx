import React from 'react';
import { Outlet } from 'react-router';
import PageHeader from '@/components/ui/header';
import { useLocation } from 'react-router';

function Layout() {
	const location = useLocation();
	const { pathname } = location;

	return (
		<div>
			<main>
				{pathname !== '/' && <PageHeader />}
				<div
					style={{
						alignItems: 'center',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
					className='dark bg-background text-foreground min-h-screen pt-5'
				>
					<Outlet />
				</div>
			</main>
		</div>
	);
}

export default Layout;
