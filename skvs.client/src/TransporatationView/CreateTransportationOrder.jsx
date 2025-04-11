import { useEffect, useState } from "react";

function CreateTransportationOrder() {
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
            const response = await fetch("/api/warehouseorder/available"); // Tik tie, kurie nepriskirti
            const data = await response.json();
            setWarehouseOrders(data);
        } catch (error) {
            console.error("Klaida gaunant sandėlio užsakymus:", error);
        }
    };

    const handleOrderToggle = (orderId) => {
        if (selectedOrders.includes(orderId)) {
            setSelectedOrders(selectedOrders.filter(id => id !== orderId));
        } else {
            setSelectedOrders([...selectedOrders, orderId]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const transportationOrder = {
            description,
            address,
            deliveryTime,
            ramp,
            state,
            isCancelled: false,
            isCompleted: false,
            isOnTheWay: false,
            createdById,
            truckPlateNumber,
            warehouseOrderIds: selectedOrders
        };

        try {
            const response = await fetch("/api/transportationorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transportationOrder),
            });

            if (response.ok) {
                alert("Sukurta sėkmingai!");
                setSelectedOrders([]); 
                if (onBack) onBack(); 
            } else {
                console.error("Klaida:", await response.text());
            }
        } catch (error) {
            console.error("Klaida:", error);
        }
    };

    return (
        <div>
            <h2>Sukurti Transportation Order</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Aprašymas" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input placeholder="Adresas" value={address} onChange={(e) => setAddress(e.target.value)} />
                <input type="date" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
                <input type="number" placeholder="Rampos nr." value={ramp} onChange={(e) => setRamp(e.target.value)} />
                <select value={state} onChange={(e) => setState(e.target.value)}>
                    <option value="Formed">Formed</option>
                    <option value="InProgress">InProgress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <input placeholder="Truck Plate Number" value={truckPlateNumber} onChange={(e) => setTruckPlateNumber(e.target.value)} />
                <input type="number" placeholder="Manager ID" value={createdById} onChange={(e) => setCreatedById(e.target.value)} />

                <h3>Pasirink sandėlio užsakymus:</h3>
                {warehouseOrders.length === 0 ? (
                    <p>Nėra laisvų užsakymų</p>
                ) : (
                    warehouseOrders.map((wo) => (
                        <div key={wo.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedOrders.includes(wo.id)}
                                    onChange={() => handleOrderToggle(wo.id)}
                                />
                                Užsakymas #{wo.id} – Kiekis: {wo.count}, Klientas ID: {wo.clientId}
                            </label>
                        </div>
                    ))
                )}

                <br />
                <button type="submit">Sukurti</button>
            </form>
        </div>
    );
}

export default CreateTransportationOrder;
