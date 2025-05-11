import React from 'react';
import { Outlet } from 'react-router';

function Layout() {
	return (
		<div>
			<main>
				<div
					style={{
						alignItems: 'center',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
					className='dark bg-background text-foreground min-h-screen'
				>
					<Outlet />
				</div>
			</main>
		</div>
	);
}

export default Layout;
