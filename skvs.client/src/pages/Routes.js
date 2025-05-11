const Routes = {
	home: '/',
	oldPage: '/oldpage',
	truckCompany: '/truckcompany',
	createTransportationOrder: '/truckcompany/createTransportationOrder',
	driver: '/driver',
	selectTime: (orderId = ':orderId') => `/driver/selectTime/${orderId}`,
	svs: '/svs',
	createWarehouseOrder: '/svs/createWarehouseOrder',
	checkWarehouseOrder: (warehouseOrderId = ':warehouseOrderId') => `/svs/checkWarehouseOrder/${warehouseOrderId}`,
};

export default Routes;
