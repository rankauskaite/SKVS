import { useEffect, useState } from "react";

function CreateTransportationOrder({ onBack }) {
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [deliveryTime, setDeliveryTime] = useState("");
    const [ramp, setRamp] = useState(1);
    const [state, setState] = useState("Formed");
    const [truckPlateNumber, setTruckPlateNumber] = useState("");
    const [createdById, setCreatedById] = useState(1);
    const [warehouseOrders, setWarehouseOrders] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);

    useEffect(() => {
        fetchAvailableWarehouseOrders();
    }, []);

    const fetchAvailableWarehouseOrders = async () => {
        try {
            const response = await fetch("/api/warehouseorder/available");
            const data = await response.json();
            setWarehouseOrders(data);
        } catch (error) {
            console.error("Klaida gaunant sandėlio užsakymus:", error);
        }
    };

    const handleOrderToggle = (orderId) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const transportationOrder = {
            description,
            address,
            deliveryTime,
            ramp: parseInt(ramp),
            state,
            isCancelled: false,
            isCompleted: false,
            isOnTheWay: false,
            createdById: parseInt(createdById),
            truckPlateNumber,
            warehouseOrderIds: selectedOrders // ❗️ TIK int[] masyvas
        };

        try {
            const response = await fetch("/api/transportationorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transportationOrder),
            });

            if (response.ok) {
                alert("Sukurta sėkmingai!");
                if (onBack) onBack();
            } else {
                const err = await response.text();
                console.error("Klaida:", err);
                alert("Serverio klaida: " + err);
            }
        } catch (error) {
            console.error("Klaida:", error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">➕ Sukurti Transportation Order</h2>
            <form onSubmit={handleSubmit} className="space-y-2">
                <input placeholder="Aprašymas" value={description} onChange={e => setDescription(e.target.value)} />
                <input placeholder="Adresas" value={address} onChange={e => setAddress(e.target.value)} />
                <input type="date" value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} />
                <input type="number" value={ramp} onChange={e => setRamp(e.target.value)} placeholder="Rampos numeris" />
                <select value={state} onChange={e => setState(e.target.value)}>
                    <option value="Formed">Formed</option>
                    <option value="InProgress">InProgress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <input placeholder="Sunkvežimio numeris" value={truckPlateNumber} onChange={e => setTruckPlateNumber(e.target.value)} />
                <input type="number" placeholder="Sukūrė (manager ID)" value={createdById} onChange={e => setCreatedById(e.target.value)} />

                <h3 className="mt-4 font-semibold">📦 Sandėlio užsakymai</h3>
                {warehouseOrders.map(wo => (
                    <label key={wo.id} className="block">
                        <input
                            type="checkbox"
                            checked={selectedOrders.includes(wo.id)}
                            onChange={() => handleOrderToggle(wo.id)}
                        />
                        {' '}
                        #{wo.id} – Kiekis: {wo.count}, Klientas ID: {wo.clientId}
                    </label>
                ))}

                <div className="flex gap-4 mt-4">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">💾 Sukurti</button>
                    <button type="button" onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded">⬅️ Atgal</button>
                </div>
            </form>
        </div>
    );
}

export default CreateTransportationOrder;
