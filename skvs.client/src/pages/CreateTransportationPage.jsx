import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import TransportationOrderForm from '../TransporatationView/TransportationOrderForm';

export default function CreateTransportationPage() {
	return <TransportationOrderForm onBack={() => window.history.back()} />;
}
