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
				>
					<Outlet />
				</div>
			</main>
		</div>
	);
}

export default Layout;
